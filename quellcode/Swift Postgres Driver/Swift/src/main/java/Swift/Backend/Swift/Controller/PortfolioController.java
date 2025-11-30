package Swift.Backend.Swift.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import Swift.Backend.Swift.Googlecheck;
import Swift.Backend.Swift.Services.PortfolioService;

/**
 * PortfolioController
 * 
 * Handles portfolio retrieval operations.
 * Provides endpoint to fetch user's full portfolio grouping data based on Google-authenticated token.
 */
@RestController
public class PortfolioController {

    // ========================
    // Dependencies
    // ========================

    private final PortfolioService portfolioService;
    private final Googlecheck google;

    /**
     * Constructor for dependency injection
     * 
     * @param google - Google token validation utility
     * @param portfolioService - Service for portfolio logic
     */
    @Autowired
    public PortfolioController( Googlecheck google, PortfolioService portfolioService){
         this.google = google; this.portfolioService = portfolioService;
    }

    // ========================
    // REST Endpoints
    // ========================

    /**
     * Retrieves portfolio data grouped by type for the given user
     * 
     * @param token - Google authentication token
     * @return Grouped portfolio data or error if token invalid
     */
    @GetMapping("/{token}/portfolio")
    public ResponseEntity<?> loadPortfolioByUserId(@PathVariable("token") String token){
        try {
            google.handleGoogleToken(token);
            String idUser = (String) google.handleGoogleToken(token).get("sub");
            return ResponseEntity.ok(portfolioService.getPortfolioGroups(idUser));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }  
}
