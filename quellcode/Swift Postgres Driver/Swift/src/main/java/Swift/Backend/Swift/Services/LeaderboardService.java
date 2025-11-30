package Swift.Backend.Swift.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Swift.Backend.Swift.Entities.Leaderboard;
import Swift.Backend.Swift.Repositories.LeaderboardRepository;

@Service
public class LeaderboardService {

    public final LeaderboardRepository leaderboardRepository;

    @Autowired
    public LeaderboardService(LeaderboardRepository leaderboardRepository){
        this.leaderboardRepository = leaderboardRepository; 
    }

    public List<Leaderboard> getLeaderboard(){
            return leaderboardRepository.getLeaderboard();
        }
    
}
