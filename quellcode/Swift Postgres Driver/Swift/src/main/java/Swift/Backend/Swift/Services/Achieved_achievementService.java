package Swift.Backend.Swift.Services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import Swift.Backend.Swift.Entities.Achieved_achievement;
import Swift.Backend.Swift.Repositories.Achieved_achievementRepository;

@Service
public class Achieved_achievementService {
    private final Achieved_achievementRepository achieved_achievementRepository;

    @Autowired
    public Achieved_achievementService(Achieved_achievementRepository achieved_achievementRepository){
        this.achieved_achievementRepository = achieved_achievementRepository;
    }
    
    public List<Achieved_achievement> getAchievedAchievementsByUser(String idUser){
        return achieved_achievementRepository.getAchievedAchievementsByUser(idUser);
    }

    @Transactional
    public void runAchievementsUpdate(){
        achieved_achievementRepository.runAchievementsUpdate();
    }
    
    public List<Achieved_achievement> getAllSelectedAchievements(){
        return achieved_achievementRepository.getAllSelectedAchievements();
    }

    public List<Achieved_achievement> getSelectedAchievementsByUser(String idUser){
        return achieved_achievementRepository.getSelectedAchievementsByUser(idUser);
    }

    @Transactional
    public void setSelectedAchievements(String userId, Long ach1, Long ach2, Long ach3){
        achieved_achievementRepository.clearSelectedAchievementsByUser(userId);
        achieved_achievementRepository.setSelectedAchievementsByUser(ach1, ach2, ach3, userId);
    }

    public Map<String, Object> getSelectedTitel(String idUser) {
        List<Object[]> result = achieved_achievementRepository.getSelectedTitelByUser(idUser);

        Object[] row = result.get(0);

        Map<String, Object> response = new HashMap<>();
        response.put("idUser", row[0]);
        response.put("idAchievement", row[1]);
        response.put("reached", row[2]);
        response.put("selectedTitel", row[3]);
        response.put("titel", row[4]);

        return response;
    }
    
    @Transactional public void setSelectedTitle(String userId, Long achievement){
        achieved_achievementRepository.clearSelectedTitelByUser(userId);
        achieved_achievementRepository.setSelectedTitelByUser(userId, achievement);
    }
}
