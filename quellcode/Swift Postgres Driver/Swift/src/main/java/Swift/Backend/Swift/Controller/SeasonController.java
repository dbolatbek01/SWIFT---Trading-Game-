package Swift.Backend.Swift.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import Swift.Backend.Swift.Googlecheck;
import Swift.Backend.Swift.Entities.Season;
import Swift.Backend.Swift.Services.SeasonService;

@RestController
public class SeasonController {
    
    private final SeasonService seasonService; 
    private final Googlecheck google;

    @Autowired
    public SeasonController (SeasonService seasonService, Googlecheck google){
        this.google = google; this.seasonService = seasonService;
    }

    @PostMapping("/runSeasonChange/{token}")
    public ResponseEntity<?> runSeasonChange(@PathVariable("token") String token){
        try{
            google.handleGoogleToken(token).get("sub");

            Season activeSeason = seasonService.runSeasonChange();
            return ResponseEntity.ok("Aktive Saison: " + activeSeason.getName());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    
    
}
