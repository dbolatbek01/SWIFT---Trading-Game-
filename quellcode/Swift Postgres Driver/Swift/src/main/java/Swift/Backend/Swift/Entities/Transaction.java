package Swift.Backend.Swift.Entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_transaction")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;


    @JsonProperty("id_user")
    @Column(name = "id_user")
    private String id_user;
    
    @JsonProperty("id_stock")
    @Column(name = "id_stock")
    private long id_stock;

    @JsonProperty("id_stock_price")    
    @Column(name = "id_stock_price")
    private Long id_stock_price;

    @Column(name = "count")
    private long count;

    @Column(name = "value")
    private double value;

    @Column(name = "date")
    private LocalDateTime date;

    @Column(name = "bs")
    private boolean bs;

    public Transaction(Long id, String id_user, long id_stock, Long id_stock_price, long count, double value, LocalDateTime date, boolean bs){
        this.id = id; this.id_user = id_user; this.id_stock = id_stock; this.id_stock_price = id_stock_price; 
        this.count = count; this.value = value; this.date = date; this.bs = bs;
    }
    
    public Transaction(){
    }

    public Transaction(long id_stock, long count){
         this.id_stock = id_stock; this.count = count;
    }

    public Long getId(){
        return id;
    }

    public void setId(Long id){
        this.id = id;
    }

    public String getIdUser(){
        return id_user;
    }

    public void setIdUser(String id_user){
        this.id_user = id_user;
    }

    public long getIdStock(){
        return id_stock;
    }

    public void setIdStock(long id_stock){
        this.id_stock = id_stock;
    }

    public long getIdStockPrice(){
        return id_stock_price;
    }

    public void setIdStockPrice(long id_stock_price){
        this.id_stock_price = id_stock_price;
    }

    public long getCount(){
        return count;
    }

    public void setCount(long count){
        this.count = count;
    }

    public double getValue(){
        return value;
    }

    public void setValue(double value){
        this.value = value;
    }

    public LocalDateTime getDate(){
        return date;
    }

    public void setDate(LocalDateTime date){
        this.date = date;
    }

    public boolean getBs(){
        return bs;
    }

    public void setBs(boolean bs){
        this.bs = bs;
    }

    @Override
    public String toString() {
        return "Transaction{" + "id=" + id + ", id_user=" + id_user + ", id_stock=" + id_stock + ", id_stock_price=" + id_stock_price + ", count=" + count + 
        ", value=" + value + ", date=" + date + '}';
    }


    
}
