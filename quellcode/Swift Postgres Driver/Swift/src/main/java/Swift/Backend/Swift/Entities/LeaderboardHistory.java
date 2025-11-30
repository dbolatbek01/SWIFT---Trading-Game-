package Swift.Backend.Swift.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity
@Table(name = "leaderboard_history")
public class LeaderboardHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id_leaderboard_history")
    private long id;

     @Column(name = "id_user")
    private String id_user;

    @Column(name = "portfolio_growth")
    private Double portflio_growth;

    @Column(name = "id_season")
    private long id_season;

    public LeaderboardHistory(){
    }

    public LeaderboardHistory(long id, String id_user, Double portflio_growth, long id_season){
        this.id = id;  this.id_user = id_user; 
        this.portflio_growth = portflio_growth; this.id_season = id_season;
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

    public double getPortfolioGrowth(){
        return portflio_growth;
    }

    public void setPortfolioGrowth(double portflio_growth){
        this.portflio_growth = portflio_growth;
    }

    public Long getIdSeason(){
        return id_season;
    }

    public void setIdSeason(Long id_season){
        this.id_season = id_season;
    }
}
