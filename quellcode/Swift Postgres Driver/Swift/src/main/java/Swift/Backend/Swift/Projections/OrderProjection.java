package Swift.Backend.Swift.Projections;

import java.time.LocalDateTime;

public interface OrderProjection {
    Long getIdOrder();
    String getIdUser();
    Long getIdStock();
    Boolean getBs();
    Long getQuantity();
    Double getAmount();
    String getOrderType();
    LocalDateTime getCreatedAt();
    LocalDateTime getUpdatedAt();
    LocalDateTime getExecutedAt();
    Double getExecutedPrice();
}
