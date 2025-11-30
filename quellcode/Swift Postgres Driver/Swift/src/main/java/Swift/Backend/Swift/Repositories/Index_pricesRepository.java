package Swift.Backend.Swift.Repositories;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import Swift.Backend.Swift.Entities.Index_prices;
import Swift.Backend.Swift.Projections.IndexPriceProjection;

/**
 * Repository for accessing index price data.
 * Provides various queries to fetch historical and recent index prices.
 */
public interface Index_pricesRepository extends JpaRepository<Index_prices, Long>{

    /**
     * Returns the most recent index price before a specified datetime.
     * @param IDIndex the ID of the index
     * @param dateTime the datetime cutoff
     * @return the latest Index_prices record before the cutoff
     */
@Query(value = "SELECT * from index_price WHERE id_index = ?1 AND date < CAST(?2 AS timestamp) ORDER BY date DESC LIMIT 1", nativeQuery =true)
    Index_prices findIndex_ValuebyIDLastPriceDayBefore(long IDIndex, String dateTime);

    /**
     * Returns the most recent index price.
     * @param IDIndex the ID of the index
     * @return the latest Index_prices record
     */
@Query(value = "SELECT * FROM index_price WHERE id_index = ?1 ORDER BY date DESC LIMIT 1" , nativeQuery = true)
    Index_prices findIndex_ValuebyIDOrderByDate(long IDIndex);

    /**
     * Returns the last index price for a specific day.
     * @param id the ID of the index
     * @param dateTime the day to filter by
     * @return the most recent Index_prices record for the given day
     */
@Query(value = "SELECT * FROM index_price WHERE id_index = ?1 AND DATE(date) = CAST(?2 AS DATE) ORDER BY date DESC LIMIT 1", nativeQuery = true)
    Index_prices findLastIndexPriceByDay(long id, String dateTime);

    /**
     * Returns index prices for the hour preceding the given datetime.
     * @param IDIndex the ID of the index
     * @param dateTime the reference datetime
     * @return list of Index_prices within the last hour
     */
@Query(value =
      "SELECT * FROM index_price " +
      "WHERE id_index = (select id_index from index inner join season on season.id_season = index.id_season where season.active_flag = true) " +
        "AND date BETWEEN CAST(?1 AS timestamp) - INTERVAL '1 hour' AND CAST(?1 AS timestamp) " +
      "ORDER BY date ASC",
      nativeQuery = true
    )
    List<Index_prices> findIndex_ValueByHour(String dateTime);

    /**
     * Returns hourly index prices for the 24 hours preceding the given datetime.
     * Only prices with minute = 0 (on the hour) are included.
     * @param IDIndex the ID of the index
     * @param date the reference date
     * @return list of Index_prices
     */
@Query(value =
      "SELECT * FROM index_price " +
      "WHERE id_index = ?1 " +
        "AND date BETWEEN CAST(?2 AS timestamp) - INTERVAL '24 hour' AND CAST(?2 AS timestamp) " +
        "AND EXTRACT(MINUTE FROM date) = 0 " +
      "ORDER BY date ASC",
      nativeQuery = true
    )
    List<Index_prices> findIndex_ValueByDay(long IDIndex, String date);

    /**
     * Returns one price per day for the last week (168 hours).
     * Uses DISTINCT ON to get the latest price per day.
     * @param IDIndex the ID of the index
     * @param date the reference date
     * @return list of Index_prices per day
     */
@Query(value =
      "SELECT DISTINCT ON (DATE(date))* FROM index_price " +
      "WHERE id_index = ?1 " +
        "AND date BETWEEN CAST(?2 AS timestamp) - INTERVAL '168 hour' AND CAST(?2 AS timestamp) " +
      "ORDER BY DATE(date), date DESC",
      nativeQuery = true
    )
    List<Index_prices> findIndex_ValueByWeek(long IDIndex, String date);

    /**
     * Returns one price per day for the last month (720 hours).
     * Uses DISTINCT ON to get the latest price per day.
     * @param IDIndex the ID of the index
     * @param date the reference date
     * @return list of Index_prices per day
     */
@Query(value =
      "SELECT DISTINCT ON (DATE(date)) * FROM index_price " +
      "WHERE id_index = ?1 " +
        "AND date BETWEEN CAST(?2 AS timestamp) - INTERVAL '720 hour' AND CAST(?2 AS timestamp) " +
      "ORDER BY DATE(date), date DESC",
      nativeQuery = true
    )
    List<Index_prices> findIndex_ValueByMonth(long IDIndex, String date);

@Query(value = """
    WITH RECURSIVE current_idx AS (
        SELECT i.id_index
        FROM public.season s
        JOIN public."index" i ON i.id_season = s.id_season
        WHERE s.active_flag = true
        ORDER BY i.id_index DESC
        LIMIT 1
    ),
    timestamps(ts, interval_value) AS (
        SELECT CAST(?1 AS timestamp), CAST(?3 AS interval)
        UNION ALL
        SELECT ts + interval_value, interval_value
        FROM timestamps
        WHERE ts < CAST(?2 AS timestamp)
    ),
    adjusted_timestamps AS (
        SELECT 
            ts AS original_ts,
            interval_value,
            CASE 
                WHEN interval_value >= INTERVAL '1 day'
                 AND ts <= (SELECT MAX(t2.ts) FROM timestamps t2) - interval_value
                THEN DATE(ts) + TIME '23:59:59'
                ELSE ts
            END AS lookup_ts
        FROM timestamps
    ),
    latest_index_prices AS (
        SELECT DISTINCT ON (t.original_ts)
            t.original_ts AS indexPriceTime,
            ip.price,
            ip.date AS price_timestamp
        FROM adjusted_timestamps t
        CROSS JOIN current_idx c
        LEFT JOIN index_price ip
          ON ip.id_index = c.id_index
         AND ip.date <= t.lookup_ts
        ORDER BY t.original_ts, ip.date DESC
    )
    SELECT indexPriceTime, price
    FROM latest_index_prices
    ORDER BY indexPriceTime;
    """, nativeQuery = true)
  List<IndexPriceProjection> findIndexValueByTime(String startTs, String endTs, String interval);
}


   
