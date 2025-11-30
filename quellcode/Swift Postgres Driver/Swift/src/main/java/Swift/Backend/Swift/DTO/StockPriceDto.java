package Swift.Backend.Swift.DTO;

import java.math.BigDecimal;

/**
 * StockPriceDto
 * 
 * Data Transfer Object (DTO) representing a historical stock price entry.
 * Contains:
 * - Stock ID
 * - Stock price record ID
 * - Date of the price
 * - Price value (as BigDecimal)
 */
public class StockPriceDto {

    // ========================
    // Fields
    // ========================

    private long id_stock;
    private long id_stock_price;
    private String datum;
    private BigDecimal wert;

    // ========================
    // Constructor
    // ========================

    /**
     * Constructs a new StockPriceDto with all required fields.
     * 
     * @param id_stock - ID of the stock
     * @param id_stock_price - ID of the stock price record
     * @param datum - Date of the price (formatted as string)
     * @param wert - Price value
     */
    public StockPriceDto(long id_stock, long id_stock_price, String datum, BigDecimal wert) {
        this.id_stock = id_stock;
        this.id_stock_price = id_stock_price;
        this.datum = datum;
        this.wert = wert;
    }

    // ========================
    // Getters and Setters
    // ========================

    public long getId_stock() {
        return id_stock;
    }

    public void setId_stock(long id_stock) {
        this.id_stock = id_stock;
    }

    public long getId_stock_price() {
        return id_stock_price;
    }

    public void setId_stock_price(long id_stock_price) {
        this.id_stock_price = id_stock_price;
    }

    public String getDatum() {
        return datum;
    }

    public void setDatum(String datum) {
        this.datum = datum;
    }

    public BigDecimal getWert() {
        return wert;
    }

    public void setWert(BigDecimal wert) {
        this.wert = wert;
    }
}
