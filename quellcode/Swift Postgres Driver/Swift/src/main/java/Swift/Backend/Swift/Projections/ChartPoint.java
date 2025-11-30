package Swift.Backend.Swift.Projections;

import java.time.LocalDateTime;

/**
 * ChartPoint
 * 
 * Projection interface representing a point on a chart.
 * Each point includes:
 * - X-axis value (timestamp)
 * - Y-axis value (numerical value)
 * 
 * Commonly used for chart rendering with time-based series data.
 */
public interface ChartPoint {
    LocalDateTime getX();  
    Double getY();         
}