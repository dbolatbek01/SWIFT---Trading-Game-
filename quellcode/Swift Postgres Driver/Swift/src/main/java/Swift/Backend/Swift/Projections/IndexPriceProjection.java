package Swift.Backend.Swift.Projections;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface IndexPriceProjection {
    LocalDateTime getIndexPriceTime();
    BigDecimal getPrice();
}
