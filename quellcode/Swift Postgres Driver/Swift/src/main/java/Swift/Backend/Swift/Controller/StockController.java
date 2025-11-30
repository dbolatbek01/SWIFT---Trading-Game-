package Swift.Backend.Swift.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import Swift.Backend.Swift.Googlecheck;
import Swift.Backend.Swift.Services.StockService;

/**
 * StockController
 * 
 * Handles stock-related operations, including:
 * - Retrieving all stocks
 * - Retrieving a single stock by ID
 * 
 * All endpoints require Google token authentication.
 */
@RestController
public class StockController {

    // ========================
    // Dependencies
    // ========================

    private final StockService stockservice;
    private final Googlecheck google;

    /**
     * Constructor for dependency injection
     * 
     * @param google - Google token validation utility
     * @param stockservice - Service handling stock logic
     */
    @Autowired
    public StockController( Googlecheck google, StockService stockservice){
        this.google = google; this.stockservice = stockservice;
    }

    // ========================
    // REST Endpoints
    // ========================

    /**
     * Retrieves a specific stock by its ID
     * 
     * @param id - Stock ID
     * @param token - Google authentication token
     * @return Stock data or unauthorized error
     */
    @GetMapping("/getStock/{IDStock}/{token}")
    public Object getStock(@PathVariable("IDStock") long id, @PathVariable("token") String token){
        try {
            google.handleGoogleToken(token);
            return stockservice.getStock(id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
        
    }

    /**
     * Loads all available stock entries
     * 
     * @param token - Google authentication token
     * @return List of stocks or error if unauthorized
     */
    @GetMapping("/loadStocks/{token}")
    public ResponseEntity<?> loadAllStocks(@PathVariable("token") String token){
        try {
            google.handleGoogleToken(token);
            return ResponseEntity.ok(stockservice.getStocks());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }
}
