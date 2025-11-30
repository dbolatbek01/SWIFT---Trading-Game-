package Swift.Backend.Swift.Services;
import Swift.Backend.Swift.Entities.Achievement;
import Swift.Backend.Swift.Repositories.AchievementRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AchievementService {
    private final AchievementRepository achievementRepository;
    
    @Autowired
    public AchievementService(AchievementRepository achievementRepository){
        this.achievementRepository = achievementRepository;
    }

    public List<Achievement> getAllAchievements(){
        return achievementRepository.getAllAchievements();
    }
}
