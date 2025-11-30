package Swift.Backend.Swift.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import Swift.Backend.Swift.Entities.Achieved_achievement;

import java.util.List;

public interface Achieved_achievementRepository extends JpaRepository<Achieved_achievement, Long> {

    @Query(value = "SELECT * FROM public.achievement_achieved " + 
                "WHERE id_user = ?1 " + 
                "AND reached = true ",
             nativeQuery = true)
    List<Achieved_achievement> getAchievedAchievementsByUser(String idUser);
    
    @Modifying
    @Query(value = "CALL public.update_achievements()", nativeQuery = true)
    void runAchievementsUpdate();

    @Query(value = "SELECT * FROM public.achievement_achieved " + 
              "WHERE selected_achievement IS NOT NULL " + 
              "ORDER BY id_achievement_achieved ASC ", nativeQuery = true)
    List<Achieved_achievement> getAllSelectedAchievements();

    @Query(value = "SELECT * FROM public.achievement_achieved " +
               "WHERE id_user = ?1 " +
               "AND reached = true " +
               "AND selected_achievement IS NOT NULL " +
               "ORDER BY selected_achievement ASC",
       nativeQuery = true)
    List<Achieved_achievement> getSelectedAchievementsByUser(String idUser);

    @Query(value = "SELECT aa.id_user, aa.id_achievement, aa.reached, aa.selected_titel, a.titel " +
           "FROM achievement_achieved aa " +
           "JOIN achievements a ON aa.id_achievement = a.id_achievement " +
           "WHERE aa.id_user = ?1 AND aa.selected_titel = 1",
       nativeQuery = true)
    List<Object[]> getSelectedTitelByUser(String idUser);

    @Modifying
    @Query(value = "UPDATE public.achievement_achieved " + 
               "SET selected_achievement = NULL " +
               "WHERE id_user = ?1 " +
               "AND selected_achievement IS NOT NULL", 
       nativeQuery = true)
    void clearSelectedAchievementsByUser(String idUser);

    @Modifying
    @Query(value = "UPDATE public.achievement_achieved " +
               "SET selected_achievement = CASE " +
               "    WHEN id_achievement = ?1 THEN 1 " +
               "    WHEN id_achievement = ?2 THEN 2 " +
               "    WHEN id_achievement = ?3 THEN 3 " +
               "END " +
               "WHERE id_user = ?4", 
       nativeQuery = true)
    void setSelectedAchievementsByUser(Long achievement1, Long achievement2, Long achievement3, String idUser);

    @Modifying
    @Query(value = "UPDATE public.achievement_achieved " +
           "SET selected_titel = NULL " +
           "WHERE id_user = ?1 " +
           "AND selected_titel = 1", 
       nativeQuery = true)
    void clearSelectedTitelByUser(String idUser);

    @Modifying
    @Query(value = "UPDATE public.achievement_achieved " +
           "SET selected_titel = 1 " +
           "WHERE id_user = ?1 " +
           "AND id_achievement = ?2 " +
           "AND reached = true", 
       nativeQuery = true)
    void setSelectedTitelByUser(String idUser, Long achievement);
}
