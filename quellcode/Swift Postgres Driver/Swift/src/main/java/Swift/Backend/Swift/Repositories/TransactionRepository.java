package Swift.Backend.Swift.Repositories;

import Swift.Backend.Swift.Entities.Transaction;
import Swift.Backend.Swift.Projections.PortfolioSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long>{

    /**
     * Returns all transactions for a given user.
     *
     * @param id_user the user ID
     * @return list of transactions
     */

     @Query(value = "SELECT * FROM transaction WHERE id_user = ?1", nativeQuery = true)
     List<Transaction> findById_user(String id_user);

    /**
     * Returns aggregated portfolio data for a user up to a specific date.
     * Only includes stocks where more were bought than sold.
     */
     @Query(value = "SELECT id_stock, SUM(CASE WHEN bs = false THEN count ELSE 0 END) AS bought, SUM(CASE WHEN bs = true THEN count ELSE 0 END) AS sold, SUM(CASE WHEN bs = false THEN count ELSE 0 END) -  SUM(CASE WHEN bs = true THEN count ELSE 0 END) AS remaining FROM transaction WHERE id_user = ?1 AND date <= CAST(?2  AS timestamp) GROUP BY id_stock\n" + //
                    "HAVING SUM(CASE WHEN bs = false THEN count ELSE 0 END) > SUM(CASE WHEN bs = true THEN count ELSE 0 END)\n" + //
                    "ORDER BY id_stock ASC ", nativeQuery = true)
     List<PortfolioOverview> getPortfolioByPeriod(String idUser, String date);
     interface PortfolioOverview{
          Long getIdStock();
          Integer getBought();
          Integer getSold();
          Integer getRemaining();
     }

    /**
     * Returns the absolute portfolio value over time for a given user.
     * Based on transactions and stock prices in the given period.
     *
     * @param idUser    User ID
     * @param date      End timestamp
     * @param date_stop Start timestamp
     * @param interval  Step interval (e.g., '1 day', '1 hour')
     */
    @Query(value = """
        WITH RECURSIVE timestamps AS (
            SELECT CAST(?2 AS TIMESTAMP) AS ts
            UNION ALL
            SELECT ts - CAST(?4 AS INTERVAL)
            FROM timestamps
            WHERE ts > CAST(?3 AS TIMESTAMP)
        ),
        all_user_transactions AS (
            SELECT
                id_stock,
                bs,
                count,
                date
            FROM transaction
            WHERE id_user = ?1
        ),
        stocks_per_time AS (
            SELECT DISTINCT ts AS snapshot_time, id_stock
            FROM timestamps, all_user_transactions
        ),
        position_per_time AS (
            SELECT 
                spt.snapshot_time,
                spt.id_stock,
                SUM(CASE WHEN t.bs = false THEN t.count ELSE 0 END) AS total_buy,
                SUM(CASE WHEN t.bs = true THEN t.count ELSE 0 END) AS total_sell
            FROM stocks_per_time spt
            LEFT JOIN all_user_transactions t
                ON spt.id_stock = t.id_stock AND t.date <= spt.snapshot_time
            GROUP BY spt.snapshot_time, spt.id_stock
        ),
        latest_prices AS (
            SELECT DISTINCT ON (spt.snapshot_time, sp.id_stock)
                spt.snapshot_time,
                sp.id_stock,
                sp.price,
                sp.date AS price_timestamp
            FROM stocks_per_time spt
            JOIN stock_price sp 
                ON sp.id_stock = spt.id_stock 
                AND sp.date <= spt.snapshot_time
            ORDER BY spt.snapshot_time, sp.id_stock, sp.date DESC
        ),
        positions AS (
            SELECT 
                ppt.snapshot_time,
                ppt.id_stock,
                ppt.total_buy,
                ppt.total_sell,
                lp.price,
                (COALESCE(ppt.total_buy, 0) - COALESCE(ppt.total_sell, 0)) * COALESCE(lp.price, 0) AS betrag
            FROM position_per_time ppt
            LEFT JOIN latest_prices lp ON ppt.snapshot_time = lp.snapshot_time AND ppt.id_stock = lp.id_stock
        )
        SELECT 
            snapshot_time,
            SUM(betrag) AS gesamt_betrag
        FROM positions
        GROUP BY snapshot_time
        ORDER BY snapshot_time DESC

        """,
        nativeQuery = true)
    List<PortfolioSnapshot> getPortfolioSnapshots(String idUser, String date, String date_stop, String interval);

    /**
     * Returns relative portfolio profit/loss over time for a given user. 
     * Calculates adjusted gain by subtracting the purchase price from 
     * the current value to isolate only gains and losses resulting from the investment.
     *
     * @param idUser    User ID
     * @param date      End timestamp
     * @param date_stop Start timestamp
     * @param interval  Step interval (e.g., '1 day', '1 hour')
     */
    @Query(value = """
    WITH PortfolioDaten AS (
	SELECT
	    T.Datum AS AbfrageDatum,
	    TVF.*
	FROM
	
	    generate_series(
	        :date_stop ::timestamp, 
            :date_start ::timestamp,
	        :interval ::interval                  
	    ) AS T(Datum)
		  LEFT JOIN LATERAL virtual_portfolio(
	        p_user_id := :user_id,
	        p_zeit_bis := T.Datum             
	    ) AS TVF ON true
	),
    TagesBasisWerte AS (
        SELECT
            PortfolioDaten.abfragedatum,
            PortfolioDaten.quantity * price - PortfolioDaten.quantity * average_price as Delta

        FROM
            PortfolioDaten 
            LEFT JOIN LATERAL (
                SELECT price FROM 
                    Stock_price AS Stock_price_Inner
                WHERE Stock_price_Inner.id_stock = PortfolioDaten.id_stock 
                AND Stock_price_Inner.date <= PortfolioDaten.AbfrageDatum 
            ORDER BY 
                    Stock_price_Inner.date DESC
                LIMIT 1
            ) AS Stock_price_Outer ON true
        WHERE
            PortfolioDaten.quantity > 0
    )
    select 
        TagesBasisWerte.AbfrageDatum as snapshot_time,
        sum(TagesBasisWerte.delta) as gesamt_betrag
    from TagesBasisWerte 
    group by TagesBasisWerte.AbfrageDatum
    order by TagesBasisWerte.AbfrageDatum
        
        """,
        nativeQuery = true)
    List<PortfolioSnapshot> getRelativePortfolioSnapshots(@Param("user_id") String idUser,@Param("date_start") String date, @Param("date_stop") String date_stop, @Param("interval") String interval);

}
