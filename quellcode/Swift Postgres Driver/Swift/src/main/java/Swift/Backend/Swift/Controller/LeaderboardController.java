package Swift.Backend.Swift.Controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import Swift.Backend.Swift.Googlecheck;
import Swift.Backend.Swift.Services.LeaderboardService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;


@RestController
public class LeaderboardController {

    private final LeaderboardService leaderboardService;
    private final Googlecheck google;

    @Autowired
    public LeaderboardController(LeaderboardService leaderboardService, Googlecheck google){
        this.leaderboardService = leaderboardService;
        this.google = google;
    }

    @GetMapping("/getLeaderboard/{token}")
    public ResponseEntity<?> getLeaderboard(@PathVariable("token") String token) {
        try {
            google.handleGoogleToken(token);
            //System.out.println(leaderboardService.getLeaderboard());
             return ResponseEntity.ok(leaderboardService.getLeaderboard());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }
    
}
