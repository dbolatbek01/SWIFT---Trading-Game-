package Swift.Backend.Swift.DTO;

import java.time.LocalDateTime;

/**
 * StockGrowthDto
 * 
 * Data Transfer Object (DTO) for stock growth analysis.
 * Represents the change in stock value over time including:
 * - Stock ID and stock price ID
 * - Timestamp of measurement
 * - Absolute value, percentage growth, and absolute change
 */
public class StockGrowthDto {

    // ========================
    // Fields
    // ========================

    private long id_stock;
    private long id_stock_price;
    private LocalDateTime datum;
    private double wert;
    private double procent;
    private double change;

    // ========================
    // Getters and Setters
    // ========================

    public long getId_stock() { return id_stock; }

    public void setId_stock(long id_stock) { this.id_stock = id_stock; }

    public long getId_stock_price() { return id_stock_price; }

    public void setId_stock_price(long id_stock_price) { this.id_stock_price = id_stock_price; }

    public LocalDateTime getDatum() { return datum; }

    public void setDatum(LocalDateTime datum) { this.datum = datum; }

    public double getWert() { return wert; }

    public void setWert(double wert) { this.wert = wert; }

    public double getProcent() { return procent; }

    public void setProcent(double procent) { this.procent = procent; }

    public double getChange() { return change; }

    public void setChange(double change) { this.change = change; }
}