package Swift.Backend.Swift.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import Swift.Backend.Swift.Entities.Stock_price;
import Swift.Backend.Swift.Projections.StockPriceProjection;

/**
 * Repository interface for accessing and querying {@link Stock_price} entities from the database.
 * <p>
 * Provides methods for retrieving stock price history at various time intervals,
 * including latest, hourly, daily, weekly, and monthly data.
 */
public interface Stock_priceRepository extends JpaRepository<Stock_price, Long>{

    /**
     * Retrieves the most recent stock price for a given stock ID.
     *
     * @param IDStock the ID of the stock
     * @return the latest {@link Stock_price} entry
     */
    @Query(value = "SELECT * FROM stock_price WHERE id_stock = ?1 ORDER BY date DESC LIMIT 1" , nativeQuery = true)
    Stock_price findStock_pricebyIDStockOrderByDate(long IDStock);

    /**
     * Retrieves all stock prices for a given stock ID from the specified timestamp onward.
     *
     * @param IDStock the ID of the stock
     * @param date the lower bound timestamp
     * @return a list of {@link Stock_price} entries in descending order
     */
    @Query(value = "SELECT * FROM stock_price WHERE id_stock = ?1 AND date >= CAST(?2 AS timestamp) ORDER BY date DESC" , nativeQuery = true)
    List<Stock_price> findStock_pricebyIDStockandPeriod(long IDStock, String date);

    /**
     * Finds the latest stock price before or at the given timestamp.
     *
     * @param idStock the ID of the stock
     * @param date the reference timestamp
     * @return the closest {@link Stock_price} before the date
     */
    @Query(value = "SELECT * FROM stock_price WHERE id_stock = ?1 AND date <= CAST(?2 AS timestamp) ORDER BY date DESC LIMIT 1", nativeQuery = true)
    Stock_price findNearestPriceBeforeDate(long idStock, String date);

    /**
     * Retrieves all stock prices for a list of stock IDs ordered by date.
     *
     * @param ids the list of stock IDs
     * @return a list of {@link Stock_price} entries
     */
    @Query(value = "SELECT * FROM stock_price WHERE id_stock IN (?1) ORDER BY id_stock, date ASC", nativeQuery = true)
    List<Stock_price> findAllByIdStockInOrderByDate(List<Long> ids);

    /**
     * Retrieves the last stock price from the previous day for the specified stock ID.
     *
     * @param IDStock the ID of the stock
     * @return the {@link Stock_price} entry from the day before
     */
    @Query(value = "SELECT * from stock_price WHERE id_stock = ?1 AND date < CURRENT_DATE ORDER BY date DESC LIMIT 1", nativeQuery =true)
    Stock_price findStock_PricebyIDLastPriceDayBefore(long IDStock);

    /**
     * Retrieves only the latest price and stock price ID as a projection.
     *
     * @param IDStock the ID of the stock
     * @return a {@link StockPriceProjection} containing selected fields
     */
    @Query(value = "SELECT id_stock_price AS idStockPrice, price FROM stock_price WHERE id_stock = ?1 ORDER BY date DESC LIMIT 1", nativeQuery = true)
    StockPriceProjection getLatestStockPrice(long IDStock);   

    /**
     * Retrieves stock prices within the last hour before a specified timestamp.
     *
     * @param IDStock the ID of the stock
     * @param dateTime the reference timestamp
     * @return a list of {@link Stock_price} entries sorted by ascending time
     */
    @Query(value =
      "SELECT * FROM stock_price " +
      "WHERE id_stock = ?1 " +
        "AND date BETWEEN CAST(?2 AS timestamp) - INTERVAL '1 hour' AND CAST(?2 AS timestamp) " +
      "ORDER BY date ASC",
      nativeQuery = true
    )
    List<Stock_price> findStock_priceByHour(long IDStock, String dateTime);

    /**
     * Retrieves stock prices for the past 24 hours where the minute is exactly 0 (e.g., hourly data points).
     *
     * @param IDStock the ID of the stock
     * @param date the reference timestamp
     * @return a list of hourly {@link Stock_price} entries
     */
    @Query(value =
      "SELECT * FROM stock_price " +
      "WHERE id_stock = ?1 " +
        "AND date BETWEEN CAST(?2 AS timestamp) - INTERVAL '24 hour' AND CAST(?2 AS timestamp) " +
        "AND EXTRACT(MINUTE FROM date) = 0 " +
      "ORDER BY date ASC",
      nativeQuery = true
    )
    List<Stock_price> findStock_priceByDay(long IDStock, String date);

    /**
     * Retrieves one stock price per day for the past week, using the latest value for each day.
     *
     * @param IDStock the ID of the stock
     * @param date the reference timestamp
     * @return a list of daily {@link Stock_price} snapshots for the week
     */
    @Query(value =
      "SELECT DISTINCT ON (DATE(date))* FROM stock_price " +
      "WHERE id_stock = ?1 " +
        "AND date BETWEEN CAST(?2 AS timestamp) - INTERVAL '168 hour' AND CAST(?2 AS timestamp) " +
      "ORDER BY DATE(date), date DESC",
      nativeQuery = true
    )
    List<Stock_price> findStock_priceByWeek(long IDStock, String date);

    /**
     * Retrieves one stock price per day for the past month, using the most recent entry per day.
     *
     * @param IDStock the ID of the stock
     * @param date the reference timestamp
     * @return a list of daily {@link Stock_price} entries over the past 30 days
     */
    @Query(value =
      "SELECT DISTINCT ON (DATE(date)) * FROM stock_price " +
      "WHERE id_stock = ?1 " +
        "AND date BETWEEN CAST(?2 AS timestamp) - INTERVAL '720 hour' AND CAST(?2 AS timestamp) " +
      "ORDER BY DATE(date), date DESC",
      nativeQuery = true
    )
    List<Stock_price> findStock_priceByMonth(long IDStock, String date);
    
    @Query(value = """
    WITH RECURSIVE timestamps(ts, interval_value) AS (
        SELECT
            CAST(?2 AS timestamp),
            CAST(?4 AS interval)  
        UNION ALL
        SELECT
            ts + interval_value,
            interval_value
        FROM timestamps
        WHERE ts < CAST(?3 AS timestamp)                
    ),
    adjusted_timestamps AS (
        SELECT
            ts AS original_ts,
            interval_value,
            CASE
                WHEN interval_value >= CAST('1 day' AS interval)
                     AND ts <= (SELECT MAX(ts) FROM timestamps) - interval_value
                THEN DATE(ts) + CAST('23:59:59' AS time)
                ELSE ts
            END AS lookup_ts
        FROM timestamps
    ),
    latest_stock_prices AS (
        SELECT DISTINCT ON (t.original_ts)
            t.original_ts AS stockPriceTime,
            sp.price      AS price,
            sp.date       AS price_timestamp
        FROM adjusted_timestamps t
        LEFT JOIN stock_price sp
            ON sp.id_stock = ?1
            AND sp.date <= t.lookup_ts
        ORDER BY t.original_ts, sp.date DESC
    )
    SELECT stockPriceTime, price
    FROM latest_stock_prices
    ORDER BY stockPriceTime ASC
    """, nativeQuery = true)
List<StockPriceProjection> findStockPriceByTime(long IDStock, String startTs, String endTs, String interval);
}
    
