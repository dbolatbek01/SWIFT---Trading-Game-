package Swift.Backend.Swift.Projections;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * PortfolioSnapshot
 * 
 * Projection interface representing a snapshot of the user's portfolio at a given point in time.
 * Includes:
 * - Timestamp of the snapshot
 * - Total portfolio value at that time
 */
public interface PortfolioSnapshot {
    LocalDateTime getSnapshotTime();
    BigDecimal getGesamtBetrag();
}
