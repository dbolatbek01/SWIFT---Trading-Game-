package Swift.Backend.Swift.DTO;

import java.time.LocalDateTime;

public class OrderRequestDTO {



    private String idUser;


    private Long idStock;


    private Boolean bs;


    private Long quantity;


    private Double amount;


    private String orderType;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime executedAt;
    private Double executedPrice;

    // Optional: gleich mit Condition-Infos
    private Double limitPrice;
    private Double stopPrice;

    // --- Konstruktoren ---
    public OrderRequestDTO() {}

    public OrderRequestDTO(String idUser, Long idStock, Boolean bs, Long quantity,
                           Double amount, String orderType, LocalDateTime createdAt,
                           LocalDateTime updatedAt, LocalDateTime executedAt, Double executedPrice,
                           Double limitPrice, Double stopPrice) {
        this.idUser = idUser; this.idStock = idStock; this.bs = bs; this.quantity = quantity;
        this.amount = amount; this.orderType = orderType; this.createdAt = createdAt; this.updatedAt = updatedAt;
        this.executedAt = executedAt; this.executedPrice = executedPrice; this.limitPrice = limitPrice;
        this.stopPrice = stopPrice;
    }

    public OrderRequestDTO(Long idStock, Boolean bs, Long quantity,
                           Double amount, String orderType,
                           Double limitPrice, Double stopPrice) {

        this.idStock = idStock; this.bs = bs; this.quantity = quantity; 
        this.amount = amount; this.orderType = orderType;
        this.limitPrice = limitPrice; this.stopPrice = stopPrice;
    }

    public OrderRequestDTO(String idUser, Long idStock, Boolean bs, Long quantity,
                           Double amount, String orderType, LocalDateTime createdAt,
                           LocalDateTime updatedAt,
                           Double limitPrice, Double stopPrice) {

        this.idUser = idUser; this.idStock = idStock; this.bs = bs; this.quantity = quantity; 
        this.amount = amount; this.orderType = orderType; this.createdAt = createdAt; this.updatedAt = updatedAt;
        this.limitPrice = limitPrice; this.stopPrice = stopPrice;
    }

    public OrderRequestDTO(String idUser, Long idStock, Boolean bs, Long quantity,
                           Double amount, String orderType, LocalDateTime createdAt,
                           LocalDateTime updatedAt,
                        Double stopPrice) {

        this.idUser = idUser; this.idStock = idStock; this.bs = bs; this.quantity = quantity; 
        this.amount = amount; this.orderType = orderType; this.createdAt = createdAt; this.updatedAt = updatedAt;
        this.stopPrice = stopPrice;
    }

    // --- Getter / Setter ---
    public String getIdUser() {
        return idUser;
    }

    public void setIdUser(String idUser) {
        this.idUser = idUser;
    }

    public Long getIdStock() {
        return idStock;
    }

    public void setIdStock(Long idStock) {
        this.idStock = idStock;
    }

    public Boolean getBs() {
        return bs;
    }

    public void setBs(Boolean bs) {
        this.bs = bs;
    }

    public Long getQuantity() {
        return quantity;
    }

    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getOrderType() {
        return orderType;
    }

    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getExecutedAt() {
        return executedAt;
    }

    public void setExecutedAt(LocalDateTime executedAt) {
        this.executedAt = executedAt;
    }

    public Double getExecutedPrice() {
        return executedPrice;
    }

    public void setExecutedPrice(Double executedPrice) {
        this.executedPrice = executedPrice;
    }

    public Double getLimitPrice() {
        return limitPrice;
    }

    public void setLimitPrice(Double limitPrice) {
        this.limitPrice = limitPrice;
    }

    public Double getStopPrice() {
        return stopPrice;
    }

    public void setStopPrice(Double stopPrice) {
        this.stopPrice = stopPrice;
    }



}
