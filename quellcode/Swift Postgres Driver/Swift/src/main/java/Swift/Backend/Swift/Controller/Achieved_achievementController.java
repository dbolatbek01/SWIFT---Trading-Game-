package Swift.Backend.Swift.Controller;
import Swift.Backend.Swift.Googlecheck;
import Swift.Backend.Swift.Entities.Achieved_achievement;
import Swift.Backend.Swift.Services.Achieved_achievementService;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
public class Achieved_achievementController {
    private final Achieved_achievementService achieved_achievementService;
    private final Googlecheck google;

    @Autowired
    public Achieved_achievementController(Achieved_achievementService achieved_achievementService, Googlecheck google){
        this.achieved_achievementService = achieved_achievementService;
        this.google = google;
    }
    
    @PostMapping("/runAchievementsUpdate/{token}")
    public ResponseEntity<?> runAchievementsUpdate(@PathVariable("token") String token){
        try{
            google.handleGoogleToken(token);
            achieved_achievementService.runAchievementsUpdate();
            return ResponseEntity.ok("Achievements updated");
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    @GetMapping("/getAchievedAchievements/{id_user}/{token}")
    public ResponseEntity<?> getAchievedAchievementsByUser(@PathVariable("id_user") String id_user,
                                                           @PathVariable("token") String token){
        try{
            google.handleGoogleToken(token);
            List<Achieved_achievement> result =
                    achieved_achievementService.getAchievedAchievementsByUser(id_user);
            return ResponseEntity.ok(result);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    @GetMapping("/getAllSelectedAchievements/{token}")
    public ResponseEntity<?> getAllSelectedAchievements(@PathVariable("token") String token) {
        try{
            google.handleGoogleToken(token);
            List<Achieved_achievement> result = achieved_achievementService.getAllSelectedAchievements();
            return ResponseEntity.ok(result);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }
    

    @GetMapping("/getSelectedAchievements/{id_user}/{token}")
    public ResponseEntity<?> getSelectedAchievementsByUser(@PathVariable("id_user") String id_user,
                                                           @PathVariable("token") String token) {
        try{
            google.handleGoogleToken(token);
            List<Achieved_achievement> result =
                    achieved_achievementService.getSelectedAchievementsByUser(id_user);
            return ResponseEntity.ok(result);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Token ungültig oder Fehler: " + e.getMessage()); 
        }
    }

    @PutMapping("/setSelectedAchievements/{id_user}/{token}")
    public ResponseEntity<?> putSelectedAchievementsByUser(
            @RequestParam("achievement1") Long achievement1,
            @RequestParam(value = "achievement2", required = false) Long achievement2,
            @RequestParam(value = "achievement3", required = false) Long achievement3,
            @PathVariable("id_user") String id_user,
            @PathVariable("token") String token) {
        try {
            google.handleGoogleToken(token);
            achieved_achievementService.setSelectedAchievements(id_user, achievement1, achievement2, achievement3);
            return ResponseEntity.ok("New selected achievements: " + achievement1 + ", " + achievement2 + ", " + achievement3);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }
    
    @GetMapping("/getSelectedTitle/{id_user}/{token}")
    public ResponseEntity<?> getSelectedTitle(@PathVariable("id_user") String idUser, @PathVariable("token") String token) {
        try{
            google.handleGoogleToken(token);
            
            Map<String, Object> result = achieved_achievementService.getSelectedTitel(idUser);

            return ResponseEntity.ok(result);

        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }
    

    @PutMapping("/setSelectedTitel/{id_user}/{token}")
    public ResponseEntity<?> setSelectedTitel(
        @RequestParam("achievement") Long achievement, 
        @PathVariable("id_user") String id_user, 
        @PathVariable("token") String token) {
           try {
            google.handleGoogleToken(token);
            achieved_achievementService.setSelectedTitle(id_user, achievement);
            return ResponseEntity.ok("New selected title: " + achievement);
           } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
           }
        }
}
