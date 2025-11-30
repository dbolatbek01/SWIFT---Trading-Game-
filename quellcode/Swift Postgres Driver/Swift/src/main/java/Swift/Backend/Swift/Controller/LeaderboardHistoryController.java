package Swift.Backend.Swift.Controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import Swift.Backend.Swift.Googlecheck;
import Swift.Backend.Swift.Services.LeaderboardHistoryService;

import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
public class LeaderboardHistoryController {

    private final LeaderboardHistoryService leaderboardHistoryService;
    private final Googlecheck google;

    @Autowired
    public LeaderboardHistoryController(LeaderboardHistoryService leaderboardHistoryService, Googlecheck google){
        this.leaderboardHistoryService = leaderboardHistoryService;
        this.google = google;
    }

    @GetMapping("/getEntireLeaderboardHistory/{token}")
    public ResponseEntity<?> getEntireLeaderboardHistory(@PathVariable("token") String token) {
        try {
            google.handleGoogleToken(token);
             return ResponseEntity.ok(leaderboardHistoryService.getEntireLeaderboardHistory());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    @GetMapping("/getLeaderboardHistoryBySeason/{ID_Season}/{token}")
    public ResponseEntity<?> getLeaderboardHistoryBySeason(@PathVariable("ID_Season") Long id_season, @PathVariable("token") String token) {
        try {
            google.handleGoogleToken(token);
             return ResponseEntity.ok(leaderboardHistoryService.getLeaderboardHistoryBySeason(id_season));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    
}
