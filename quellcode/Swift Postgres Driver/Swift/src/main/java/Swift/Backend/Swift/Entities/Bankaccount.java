package Swift.Backend.Swift.Entities;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Bankaccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bankaccount")
    private long id;

    @JsonProperty("id_user")
    @Column(name = "id_user")
    private String idUser;

    @Column(name = "startworth")
    private double startworth;

    @JsonProperty("current_worth")
    @Column(name = "current_worth")
    private double currentWorth;

    public Bankaccount(long id, String idUser, double startworth, double currentWorth){
        this.id = id; this.idUser = idUser; this.startworth = startworth; this.currentWorth = currentWorth;
    }

    // extra constructor without an ID because the ID is generated automatically in Service.buyStock()
    public Bankaccount(String idUser, double startworth, double currentWorth){
        this.idUser = idUser; this.startworth = startworth; this.currentWorth = currentWorth;
    }
    
    public Bankaccount(){
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

    public double getStartWorth(){
        return startworth;
    }

    public void setStartWorth(double startworth){
        this.startworth = startworth;
    }

    public double getCurrentWorth(){
        return currentWorth;
    }

    public void setCurrentWorth(double currentWorth){
        this.currentWorth = currentWorth;
    }
}
