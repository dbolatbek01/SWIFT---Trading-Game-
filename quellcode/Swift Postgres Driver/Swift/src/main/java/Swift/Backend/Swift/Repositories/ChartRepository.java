package Swift.Backend.Swift.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import Swift.Backend.Swift.Entities.Portfolio;
import Swift.Backend.Swift.Projections.PortfolioSnapshot;

/**
 * Repository interface for retrieving chart-related portfolio data.
 * Provides methods to calculate the historical performance of a user's portfolio,
 * including stock values and bank balances over a given period.
 */
public interface ChartRepository extends JpaRepository<Portfolio, Long> {

    /**
     * Returns a list of portfolio snapshots representing the total value (stock + bank)
     * of a user's portfolio over a specified period and interval.
     *
     * <p>The calculation is done using a recursive CTE that:
     * <ul>
     *   <li>Generates timestamps in the specified interval</li>
     *   <li>Calculates the user's net stock position at each time</li>
     *   <li>Fetches the latest stock prices available at each timestamp</li>
     *   <li>Multiplies the net stock count by the latest price to get stock value</li>
     *   <li>Adds corresponding bank account values per timepoint</li>
     * </ul>
     *
     * @param idUser     the ID of the user whose data is requested
     * @param date       the starting timestamp (inclusive)
     * @param date_stop  the end timestamp (exclusive)
     * @param interval   the time interval (e.g. '1 hour', '1 day')
     * @return a list of {@link PortfolioSnapshot} containing snapshot time and total value
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
          LEFT JOIN latest_prices lp 
              ON ppt.snapshot_time = lp.snapshot_time 
              AND ppt.id_stock = lp.id_stock
      ),
      portfolio_value AS (
          SELECT 
              snapshot_time,
              SUM(betrag) AS gesamt_betrag
          FROM positions
          GROUP BY snapshot_time
      ),
      bank_rn AS (
          SELECT *,
                ROW_NUMBER() OVER (ORDER BY id_bankaccount) AS rn
          FROM bankaccount
          WHERE id_user = ?1
      ),
      trans_rn AS (
          SELECT *,
                ROW_NUMBER() OVER (ORDER BY id_transaction) AS rn
          FROM transaction
          WHERE id_user = ?1
      ),
      bank_with_time AS (
          SELECT
              b.current_worth,
              COALESCE(t.date, TIMESTAMP '1970-01-01') AS bank_time  -- fallback für Startguthaben
          FROM bank_rn b
          LEFT JOIN trans_rn t ON b.rn = t.rn + 1
      ),
      bank_balance AS (
          SELECT 
              t.ts AS snapshot_time,
              (
                  SELECT bw.current_worth
                  FROM bank_with_time bw
                  WHERE bw.bank_time <= t.ts
                  ORDER BY bw.bank_time DESC
                  LIMIT 1
              ) AS bankguthaben
          FROM timestamps t
      )

      SELECT 
          pv.snapshot_time,
          pv.gesamt_betrag + bb.bankguthaben AS gesamt_Betrag

      FROM portfolio_value pv
      JOIN bank_balance bb ON pv.snapshot_time = bb.snapshot_time
      ORDER BY pv.snapshot_time DESC;

        """, nativeQuery = true)
    List<PortfolioSnapshot> findPeriodPerformance(String idUser, String date, String date_stop, String interval);


}

