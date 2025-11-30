package Swift.Backend.Swift.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Table;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;



@Entity
@Table(name = "v_leaderboard")
public class Leaderboard {
    @Id
    @Column(name = "id_users_cust")
    private String idUsersCust;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "email")
    private String email;

    @Column(name = "depot_balance")
    private Double depotBalance;

    @Column(name = "index_performance")
    private Double indexPerformance;

    @Column(name = "performance_vs_index")
    private Double performanceVsIndex;

    public Leaderboard() {

    }
    public Leaderboard(String idUsersCust, String userName, String email, Double depotBalance,
                       Double indexPerformance, Double performanceVsIndex) {
        this.idUsersCust = idUsersCust;
        this.userName = userName;
        this.depotBalance = depotBalance;
        this.indexPerformance = indexPerformance;
        this.performanceVsIndex = performanceVsIndex;
    }

    public String getIdUsersCust() { 
        return idUsersCust; 
    }

    public void setIdUsersCust(String idUsersCust) { 
        this.idUsersCust = idUsersCust; 
    }

    public String getUserName() { 
        return userName; 
    }
    
    public void setUserName(String userName) { 
        this.userName = userName; 
    }

    public String getEMail() { 
        return email; 
    }
    
    public void setEMail(String email) { 
        this.email = email; 
    }

    public Double getDepotBalance() { 
        return depotBalance; 
    }

    public void setDepotBalance(Double depotBalance) { 
        this.depotBalance = depotBalance; 
    }

    public Double getIndexPerformance() { 
        return indexPerformance; 
    }

    public void setIndexPerformance(Double indexPerformance) { 
        this.indexPerformance = indexPerformance; 
    }

    public Double getPerformanceVsIndex() { 
        return performanceVsIndex; 
    }

    public void setPerformanceVsIndex(Double performanceVsIndex) { 
        this.performanceVsIndex = performanceVsIndex; 
    }
}