package Swift.Backend.Swift.Repositories;

import Swift.Backend.Swift.Entities.Leaderboard;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;

public interface LeaderboardRepository extends JpaRepository<Leaderboard, String>{

    @Query(value="select * from v_leaderboard", nativeQuery = true)
    List<Leaderboard> getLeaderboard();
    
}
