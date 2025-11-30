package Swift.Backend.Swift.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Swift.Backend.Swift.Entities.Leaderboard;
//import Swift.Backend.Swift.Entities.LeaderboardHistory;
import Swift.Backend.Swift.Repositories.LeaderboardHistoryRepository;


import java.util.List;

@Service
public class LeaderboardHistoryService {

    public final LeaderboardHistoryRepository leaderboardHistoryRepository;

    @Autowired
    public LeaderboardHistoryService(LeaderboardHistoryRepository leaderboardHistoryRepository){
        this.leaderboardHistoryRepository = leaderboardHistoryRepository;
    }

    public List<Leaderboard> getEntireLeaderboardHistory(){
        return leaderboardHistoryRepository.getEntireLeaderboardHistory();
    }

    public List<Leaderboard> getLeaderboardHistoryBySeason(Long id_season){
        return leaderboardHistoryRepository.getLeaderboardHistoryBySeason(id_season);
    }
}
