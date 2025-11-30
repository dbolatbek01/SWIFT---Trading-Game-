package Swift.Backend.Swift.Entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Stock_price {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_stock_price")
    private long id;

    @Column(name = "id_stock")
    private long idStock;

    @Column(name = "price")
    private double price;

    @Column(name = "date")
    private LocalDateTime date; 

    public Stock_price(){
    }

    public Stock_price(long id, long idStock,  double price, LocalDateTime date){
        this.id = id; this.idStock = idStock; this.price = price; this.date = date; 
    }

    public long getId(){
        return id;
    }

    public void setId(long id){
        this.id = id;
    }

    public long getIdStock(){
        return idStock;
    }

    public void setIdStock(long idStock){
        this.idStock = idStock;
    }

    public double getPrice(){
        return price;
    }

    public void setPrice(double price){
        this.price = price;
    }

    public LocalDateTime getDate(){
        return date;
    }

    public void setDate(LocalDateTime date){
        this.date = date;
    }
}

/*Stock_prices:
ID int,
IDStock int,
Price float,
Datetime Date */
