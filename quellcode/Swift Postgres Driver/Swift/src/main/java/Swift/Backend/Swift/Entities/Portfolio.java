package Swift.Backend.Swift.Entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_portfolio")
    private Long id;

    @JsonProperty("id_user")
    @Column(name = "id_user")
    private String idUser;

    @Column(name = "id_stock_price")
    private long idStockPrice;

    @JsonProperty("id_stock")
    @Column(name = "id_stock")
    private long idStock;

    @Column(name = "count")
    private long count;

    @Column(name = "value")
    private double value;

    @Column(name = "date")
    private LocalDateTime date;

    public Portfolio(Long id, String idUser, long idStockPrice, long idStock, long count, double value, LocalDateTime date){
        this.id = id; this.idUser = idUser; this.idStockPrice = idStockPrice; this.idStock = idStock;
        this.count = count; this.value = value; this.date = date;
    }
    // extra constructor without an ID because the ID is generated automatically in Service.buyStock()
    public Portfolio(String idUser, long idStockPrice, long idStock, long count, double value, LocalDateTime date){
        this.idUser = idUser; this.idStockPrice = idStockPrice; this.idStock = idStock;
        this.count = count; this.value = value; this.date = date;
    }
    // extra constructor without an ID because the ID is generated automatically in Service.buyStock()
    public Portfolio(String idUser, long idStockPrice, long count, double value, LocalDateTime date){
        this.idUser = idUser; this.idStockPrice = idStockPrice; 
        this.count = count; this.value = value; this.date = date;
    }
    
    public Portfolio(){
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

    public long getStockPrice(){
        return idStockPrice;
    }

    public void setStockPrice(long idStockPrice){
        this.idStockPrice = idStockPrice;
    }

    public long getStock(){
        return idStock;
    }

    public void setStock(long idStock){
        this.idStock = idStock;
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

}
