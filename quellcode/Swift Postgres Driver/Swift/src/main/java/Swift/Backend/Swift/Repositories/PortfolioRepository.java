package Swift.Backend.Swift.Repositories;


import Swift.Backend.Swift.Entities.Portfolio;
import Swift.Backend.Swift.Projections.PortfolioView;

import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;

/**
 * Repository interface for accessing and manipulating {@link Portfolio} data.
 * Includes both derived query methods and complex native SQL queries for performance-optimized operations.
 */
public interface PortfolioRepository  extends JpaRepository<Portfolio, Long>{

    /**
     * Finds all portfolio entries for a given user ID.
     *
     * @param idUser the ID of the user
     * @return a list of {@link Portfolio} records
     */
    List<Portfolio> findByIdUser(String idUser);

    /**
     * Returns grouped portfolio data for a given user: stock ID, total count, and average value.
     * <p>
     * This is a more performant SQL-based grouping query.
     *
     * @param idUser the ID of the user
     * @return a list of {@link PortfolioGroup} projections
     */
    @Query(value="SELECT id_user AS idUser, id_stock as idStock, COUNT(count) as count, AVG(value) as value FROM public.portfolio WHERE id_user = ?1 GROUP BY id_user, id_stock", nativeQuery = true)
    List<PortfolioGroup> findPortfolioGroupByIdUser(String idUser);

    /**
     * Projection interface representing grouped portfolio data.
     */
    interface PortfolioGroup{
        String getIdUser();
        Long getIdStock();
        Long getCount();
        Double getValue(); 
    }

    /**
     * Returns the total value of a user's portfolio up to a specific date.
     *
     * @param idUser the ID of the user
     * @param date   the upper bound timestamp
     * @return a {@link PortfolioSnapshot} projection with total value
     */
     @Query(value="SELECT id_user AS idUser, SUM(count * value) AS totalValue FROM public.portfolio WHERE id_user = ?1 AND date <= CAST(?2 AS timestamp) GROUP BY id_user", nativeQuery = true)
    PortfolioSnapshot findPortfolioByPeriod(String idUser, String date);

    /**
     * Projection interface representing a summarized portfolio snapshot.
     */
    interface PortfolioSnapshot{
        String getIdUser();
        Double getTotalValue(); 
    }

    /**
     * Counts the number of portfolio entries for a specific user and stock combination.
     *
     * @param IDStock the ID of the stock
     * @param IDUser  the ID of the user
     * @return number of matching portfolio entries
     */
    @Query(value = "SELECT COUNT(id_portfolio) FROM portfolio WHERE id_stock = ?1 AND id_user = ?2", nativeQuery = true)
    Long getStockCountByIDs(long IDStock,  String IDUser);

    /**
     * Deletes a specific number of portfolio entries for a user and stock, ordered by the oldest date.
     * <p>
     * Uses a CTE to select the entries to delete, improving performance.
     *
     * @param IDStock the ID of the stock
     * @param IDUser  the ID of the user
     * @param Count   number of entries to delete
     * @return number of deleted rows
     */
    @Modifying
    @Query(value = """
        WITH to_delete AS MATERIALIZED (
            SELECT id_portfolio FROM portfolio 
            WHERE id_stock = ?1 AND id_user = ?2 
            ORDER BY date ASC 
            LIMIT ?3
        )
        DELETE FROM portfolio 
        WHERE id_portfolio IN (SELECT id_portfolio FROM to_delete)
        """, nativeQuery = true)
    int deleteByIDAndCount(long IDStock, String IDUser, long Count);

    /**
     * Counts how many portfolio entries exist for a user and a given stock.
     *
     * @param IDStock the ID of the stock
     * @param IDUser  the ID of the user
     * @return count of matching entries
     */
    @Query(value = "select count(*) from portfolio where id_stock = ?1 AND id_user = ?2", nativeQuery = true)
    long getCountofStock(long IDStock, String IDUser);

    /**
     * Retrieves the user's portfolio data including the latest price for each stock.
     * <p>
     * Aggregates the total count per stock and joins it with the most recent stock price to calculate total value.
     *
     * @param IDUser the ID of the user
     * @return a list of {@link PortfolioView} projections with price and value details
     */
    @Query(value = """
        SELECT 
            s.price AS latestPrice,
            p.total_count AS count,
            ?1 as idUser,
            p.id_stock AS idStock,
            p.total_count * s.price AS totalValue
        FROM (
            SELECT 
                id_stock, 
                SUM(count) AS total_count
            FROM portfolio
            WHERE id_user = ?1
            GROUP BY id_stock
        ) AS p
        JOIN (
            SELECT sp1.*
            FROM stock_price sp1
            INNER JOIN (
                SELECT 
                    id_stock, 
                    MAX(id_stock_price) AS max_id
                FROM stock_price
                GROUP BY id_stock
            ) sp2
            ON sp1.id_stock = sp2.id_stock AND sp1.id_stock_price = sp2.max_id
        ) AS s
        ON p.id_stock = s.id_stock
        """, nativeQuery = true)
    List<PortfolioView> findUserPortfolioWithLatestPrices(String IDUser);
}
