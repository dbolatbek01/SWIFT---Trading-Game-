package Swift.Backend.Swift.Repositories;

import Swift.Backend.Swift.Entities.Leaderboard;
import Swift.Backend.Swift.Entities.LeaderboardHistory;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaderboardHistoryRepository extends JpaRepository<LeaderboardHistory, Long>{

    @Query(value="select leaderboard_history.id_user as id_users_cust, user_service.name as user_name, user_service.email, leaderboard_history.depot_balance, leaderboard_history.index_performance, leaderboard_history.portfolio_growth as performance_vs_index \r\n" + //
                "from leaderboard_history inner join user_service on leaderboard_history.id_user = user_service.id_user", nativeQuery = true)
    List<Leaderboard> getEntireLeaderboardHistory();

    @Query(value="select leaderboard_history.id_user as id_users_cust, user_service.name as user_name, user_service.email, leaderboard_history.depot_balance, leaderboard_history.index_performance, leaderboard_history.portfolio_growth as performance_vs_index \r\n" + //
                "from leaderboard_history inner join user_service on leaderboard_history.id_user = user_service.id_user where id_season = ?1 and id_season_intern = (select id_season_intern from leaderboard_history where id_season = ?1 order by id_season_intern desc limit 1)", nativeQuery = true)
    List<Leaderboard> getLeaderboardHistoryBySeason(Long id_season);
    
}
