package Swift.Backend.Swift.Entities;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_order")
    private long id;

    @Column(name = "id_user")
    private String idUser;

    @Column(name = "id_stock")
    private long idStock;

    @Column(name = "bs")
    private boolean bs;

    @Column(name = "quantity")
    private Long quantity;

    @Column(name = "amount")
    private double amount;

    @Column(name = "order_type")
    private String order_type;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    @Column(name = "executed_at")
    private LocalDateTime executed_at;

    @Column(name = "executed_price")
    private double executed_price;

     

     public Orders(String idUser, Long idStock, boolean bs, Long quantity, 
                    Double amount, String order_type, LocalDateTime created_at,
                    LocalDateTime updated_at, LocalDateTime executed_at, double executed_price) {
        this.idUser = idUser; this.idStock = idStock; this.bs = bs; 
        this.quantity = quantity; this.amount = amount; this.order_type = order_type;
        this.created_at = created_at; this.updated_at = updated_at; 
        this.executed_at = executed_at; this.executed_price = executed_price;
    }

    public Orders(String idUser, Long idStock, boolean bs, Long quantity, 
                    Double amount, String order_type, LocalDateTime created_at,
                    LocalDateTime updated_at) {
        this.idUser = idUser; this.idStock = idStock; this.bs = bs; 
        this.quantity = quantity; this.amount = amount; this.order_type = order_type;
        this.created_at = created_at; this.updated_at = updated_at; 
    }

    public Orders() {
     }

    public long getId(){
        return id;
    }

    public void setId(long id){
        this.id = id;
    }

    public String getIdUser(){
        return idUser;
    }

    public void setIdUser(String idUser){
        this.idUser = idUser;
    }

    public long getIdStock() {
        return idStock;
    }

    public void setIdStock(long idStock) {
        this.idStock = idStock;
    }

    public boolean getBs(){
        return bs;
    }

    public void setBs(boolean bs){
        this.bs = bs;
    }

    public Long getQuantity(){
        return quantity;
    }

    public void setQuantity(Long quantity){
        this.quantity = quantity;
    }

    public Double getAmount(){
        return amount;
    }

    public void setAmount(Double amount){
        this.amount = amount;
    }

    public String getOrderType(){
        return order_type;
    }

    public void setOrderType(String order_type){
        this.order_type = order_type;
    }

    public LocalDateTime getCreatedAt(){
        return created_at;
    }

    public void setCreatedAt(LocalDateTime created_at){
        this.created_at = created_at;
    }

    public LocalDateTime getUpdatedAt(){
        return updated_at;
    }

    public void setUpdatedAt(LocalDateTime updated_at){
        this.updated_at = updated_at;
    }

    public LocalDateTime getExecutedAt(){
        return executed_at;
    }

    public void setExecutedAt(LocalDateTime executed_at){
        this.executed_at = executed_at;
    }

    public double getExecutedPrice(){
        return executed_price;
    }

    public void setExecutedPrice(double executed_price){
        this.executed_price = executed_price;
    }
}

