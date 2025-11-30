package Swift.Backend.Swift.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import Swift.Backend.Swift.Googlecheck;
import Swift.Backend.Swift.Services.AchievementService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
public class AchievementController {
    private final AchievementService achievementService;
    private final Googlecheck google;

    @Autowired AchievementController(AchievementService achievementService, Googlecheck google){
        this.achievementService = achievementService; this.google = google;
    }

    @GetMapping("/getAllAchievements/{token}")
    public ResponseEntity<?> getAllAchievements(@PathVariable("token") String token) {
        try{
            google.handleGoogleToken(token);
            return ResponseEntity.ok(achievementService.getAllAchievements());
        } catch (Exception e){
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage()); 
        }
    }
    


    
}
