package Swift.Backend.Swift.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.GenerationType;;

@Entity
public class Achieved_achievement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_achievement_achieved")
    private long id;

    @Column(name = "id_achievement")
    private long idAchievement;

    @Column(name = "id_user")
    private String idUser;

    @Column(name = "progress")
    private long progress;

    @Column(name = "reached")
    private boolean reached;

    @Column(name = "selected_achievement")
    private Integer selected_achievement;

    @Column(name = "selected_titel")
    private Integer selected_titel;

    public Achieved_achievement(){
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getIdAchievement() {
        return idAchievement;
    }

    public void setIdAchievement(long idAchievement) {
        this.idAchievement = idAchievement;
    }

    public String getIdUser() {
        return idUser;
    }

    public void setIdUser(String idUser) {
        this.idUser = idUser;
    }

    public long getProgress() {
        return progress;
    }

    public void setProgress(long progress) {
        this.progress = progress;
    }

    public boolean isReached() {
        return reached;
    }

    public void setReached(boolean reached) {
        this.reached = reached;
    }

    public Integer getSelected_achievement() {
        return selected_achievement;
    }

    public void setSelected_achievement(Integer selected_achievement) {
        this.selected_achievement = selected_achievement;
    }

    public Integer getSelected_title() {
        return selected_titel;
    }

    public void setSelected_title(Integer selected_titel) {
        this.selected_titel = selected_titel;
    }

}
