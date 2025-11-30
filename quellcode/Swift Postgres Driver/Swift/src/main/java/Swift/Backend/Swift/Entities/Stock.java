package Swift.Backend.Swift.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_stock")
    private long id;

    @Column(name = "name")
    private String stockname;

    @Column(name = "shortname")
    private String shortname;

    @Column(name = "sector")
    private String sector;

    @Column(name = "industry")
    private String industry;

    public Stock(long id, String stockname, String shortname, String sector, String industry){
        this.id = id; this.stockname = stockname; this.shortname = shortname; this.sector = sector; this.industry = industry;
    }
    
    public Stock(){
    }

    public long getId(){
        return id;
    }

    public void setId(long id){
        this.id = id;
    }

    public String getStockname(){
        return stockname;
    }

    public void setStockname(String stockname){
        this.stockname = stockname;
    }

    public String getShortname(){
        return shortname;
    }

    public void setShortname(String shortname){
        this.shortname = shortname;
    } 

    public String getSector(){
        return sector;
    }

    public void setSector(String sector){
        this.sector = sector;
    }

    public String getIndustry(){
        return industry;
    }

    public void setIndustry(String industry){
        this.industry = industry;
    } 
}


/*Stock:
ID int,
Stockname String,
Aktienkuerzel String, */
