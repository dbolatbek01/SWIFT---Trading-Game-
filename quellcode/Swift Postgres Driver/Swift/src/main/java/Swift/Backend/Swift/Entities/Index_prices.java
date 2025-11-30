package Swift.Backend.Swift.Entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Index_prices {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_index_price")
    private long id;

    @Column(name = "id_index")
    private long idIndex;

    @Column(name = "price")
    private double price;

    @Column(name = "date")
    private LocalDateTime datetime; 

    public Index_prices(){
    }

    public Index_prices(long id, long idIndex,  double price, LocalDateTime datetime){
        this.id = id; this.idIndex = idIndex; this.price = price; this.datetime = datetime; 
    }

    public long getId(){
        return id;
    }

    public void setId(long id){
        this.id = id;
    }

    public long getIdIndex(){
        return idIndex;
    }

    public void setIdIndex(long idIndex){
        this.idIndex = idIndex;
    }

    public double getPrice(){
        return price;
    }

    public void setPrice(double price){
        this.price = price;
    }

    public LocalDateTime getDatetime(){
        return datetime;
    }

    public void setDatetime(LocalDateTime datetime){
        this.datetime = datetime;
    }


}


