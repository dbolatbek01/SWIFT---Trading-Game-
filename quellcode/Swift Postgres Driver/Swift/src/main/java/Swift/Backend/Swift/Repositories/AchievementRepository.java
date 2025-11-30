package Swift.Backend.Swift.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import Swift.Backend.Swift.Entities.Achievement;
import java.util.List;

public interface AchievementRepository extends JpaRepository<Achievement, Long>{
    @Query(value = "SELECT * FROM public.achievements", nativeQuery = true)
    List<Achievement> getAllAchievements();

}