package Swift.Backend.Swift.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Orders_condition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_order_condition")
    private long id;

    @Column(name = "id_order")
    private long idOrder;

    @Column(name = "limit_price")
    private Double limit_price;

    @Column(name = "stop_price")
    private Double stop_price;

    public Orders_condition(long idOrder, Double limit_price, Double stop_price) {
        this.idOrder = idOrder; this.limit_price = limit_price; this.stop_price = stop_price;
    }

    public Orders_condition() {
     }

     public long getId(){
        return id;
    }

    public void setId(long id){
        this.id = id;
    }

    public long getIdOrder(){
        return idOrder;
    }

    public void setIdOrder(long idOrder){
        this.idOrder = idOrder;
    }

    public Double getLimitPrice(){
        return limit_price;
    }

    public void setLimitPrice(Double limit_price){
        this.limit_price = limit_price;
    }

    public Double getStopPrice(){
        return stop_price;
    }

    public void setStopPrice(Double stop_price){
        this.stop_price = stop_price;
    }
}
