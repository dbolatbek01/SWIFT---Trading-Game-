package Swift.Backend.Swift.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import Swift.Backend.Swift.Googlecheck;
import Swift.Backend.Swift.Services.BankaccountService;

/**
 * BankaccountController
 * 
 * REST controller for handling bank account-related endpoints.
 * 
 * Provides:
 * - Retrieval of current bank account worth
 * - Google token authentication
 */
@RestController
public class BankaccountController {

    // ========================
    // Dependencies
    // ========================
    
    private final BankaccountService bankaccountService;
    private final Googlecheck google;

    /**
     * Constructor injection of required services.
     * 
     * @param bankaccountService - Service for bank account logic
     * @param google - Utility for validating Google ID tokens
     */
    @Autowired
    public BankaccountController(BankaccountService bankaccountService, Googlecheck google){
        this.bankaccountService = bankaccountService;
        this.google = google;
    }

    // ========================
    // REST Endpoints
    // ========================

    /**
     * Get current worth of a user's bank account.
     * 
     * Authenticates the request using a Google token and returns the calculated balance.
     * 
     * @param token - Google authentication token (JWT)
     * @return 200 OK with bank account data if token valid, 
     *         401 UNAUTHORIZED if token is invalid or an error occurs
     */
    @GetMapping("/getCurrentWorthBankaccount/{token}")
    public ResponseEntity<?> getCurrentWorthBankaccount(@PathVariable("token") String token) {
        try {

            // Extract user ID from token
            String IDUser = (String) google.handleGoogleToken(token).get("sub");
            // Fetch current bank account worth
            Map<String, Object> payload = bankaccountService.getCurrentWorthBankaccount(IDUser);
             // Return successful response
            return ResponseEntity.ok(payload);
        } catch (Exception e) {
            // Return error response in case of invalid token or other issues
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }


}
