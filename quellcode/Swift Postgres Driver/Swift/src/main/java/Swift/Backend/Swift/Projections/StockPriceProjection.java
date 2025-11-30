package Swift.Backend.Swift.Projections;

import java.time.LocalDateTime;

/**
 * StockPriceProjection
 * 
 * Projection interface for retrieving minimal stock price information.
 * Includes:
 * - Stock price record ID
 * - Price value
 */
public interface StockPriceProjection {
    Long getIdStockPrice();
    LocalDateTime getStockPriceTime();
    Double getPrice();
}
