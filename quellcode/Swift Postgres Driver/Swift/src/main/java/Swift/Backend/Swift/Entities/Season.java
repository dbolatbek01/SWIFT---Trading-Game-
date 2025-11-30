package Swift.Backend.Swift.Entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity
public class Season {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_season_intern")
    private long idSeasonIntern;

    @Column(name = "id_season")
    private long idSeason;

    @Column(name = "name")
    private String name;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "active_flag")
    private boolean activeFlag;

    @Column(name = "start_balance")
    private long startBalance;

    public Season(long idSeason, String name, LocalDateTime startDate, LocalDateTime endDate, boolean activeFlag, long startBalance){
        this.idSeason = idSeason; this.name = name; this.startDate = startDate; this.endDate = endDate; this.activeFlag = activeFlag; this.startBalance = startBalance; 
    }

    public Season(){

    }
    
    public long getIdIntern(){
        return idSeasonIntern;
    }
    
    public void setIdIntern(long idSeasonIntern){
        this.idSeasonIntern = idSeasonIntern;
    }

    public long getId(){
        return idSeason;
    }
    
    public void setId(long idSeason){
        this.idSeason = idSeason;
    }

    public String getName(){
        return name;
    }
         
    public void setName(String name){
        this.name = name;
    }

    public LocalDateTime getStartDate(){
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate){
        this.startDate = startDate;
    }
    
    public LocalDateTime getEndDate(){
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate){
        this.endDate = endDate;
    }

    public boolean getActiveFlag(){
        return activeFlag;
    }

    public void setActiveFlag(boolean activeFlag){
        this.activeFlag = activeFlag;
    }

    public long getStartBalance(){
        return startBalance;
    }

    public void setStartBalance(long startBalance){
        this.startBalance = startBalance;
    }
}
