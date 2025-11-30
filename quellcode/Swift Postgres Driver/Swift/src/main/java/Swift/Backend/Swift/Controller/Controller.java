package Swift.Backend.Swift.Controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import Swift.Backend.Swift.Googlecheck;
import Swift.Backend.Swift.Entities.Transaction;
import Swift.Backend.Swift.Projections.PortfolioSnapshot;
import Swift.Backend.Swift.Services.Service;

/**
 * Controller
 * 
 * Handles portfolio-related operations such as:
 * - Buying and selling stocks
 * - Retrieving portfolio value at various time intervals
 * - Validating Google tokens
 * - Loading current portfolio data
 */
@RestController
public class Controller {

    // ========================
    // Dependencies
    // ========================

    private final Service service;
    private final Googlecheck google;

    /**
     * Constructor for dependency injection
     */
    @Autowired
    public Controller(Service service, Googlecheck google){
        this.service = service;
        this.google = google;
    }

    // ========================
    // Stock Transactions
    // ========================

    /**
     * Endpoint to buy a stock
     * 
     * @param token - Google user token
     * @param transaction - Stock transaction details
     * @return Result of the buy operation or error
     */
    @PostMapping("/buyStock/{token}")
    public ResponseEntity<?> buyStock(@PathVariable("token") String token, @RequestBody Transaction transaction){
        try {
            String idUser = (String) google.handleGoogleToken(token).get("sub");
            return ResponseEntity.ok(service.buyStock(idUser, transaction));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    /**
     * Endpoint to sell a stock
     */
    @PostMapping("/sellStock/{token}")
    public ResponseEntity<?> sellStock(@PathVariable("token") String token, @RequestBody Transaction transaction){
        try {
            String idUser = (String) google.handleGoogleToken(token).get("sub");
            return ResponseEntity.ok(service.sellStock(idUser, transaction));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    // ========================
    // Portfolio Information
    // ========================

    /**
     * Retrieves current index growth for a given index ID
     */
    @GetMapping("/getCurrentIndex/{IDIndex}/{token}")
    public ResponseEntity<?> getCurrentIndexGrowth(@PathVariable("IDIndex") long id, @PathVariable("token") String token){
        try{
            google.handleGoogleToken(token).get("sub");
            return ResponseEntity.ok(service.getCurrentIndexGrowth(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    /**
     * Retrieves the current portfolio by user ID
     */
    @GetMapping("/{token}/currentPortfolio")
    public ResponseEntity<?> loadCurrentPortfolioByUserId(@PathVariable("token") String token){
        try{
            google.handleGoogleToken(token);
            String idUser = (String) google.handleGoogleToken(token).get("sub");
            return ResponseEntity.ok(service.getCurrentPortfolioGroups(idUser));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        } 
    }


    // ========================
    // Utility Endpoints
    // ========================

    /**
     * Verifies a Google token and returns user info
     */
    @GetMapping("/google/{token}")
    public ResponseEntity<?> verifyGoogleTokenPath(@PathVariable("token") String token) {
        try {
            return ResponseEntity.ok(google.handleUserLogin(google.handleGoogleToken(token)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    /**
     * Returns hourly portfolio snapshot for the last 24h
     */
    @GetMapping("/chart/daily/{token}")
        public ResponseEntity<?> getDailyChart(@PathVariable("token") String token) {
            // Endpoint to retrieve the relative portfolio value for today, sampled at a 1-hour interval.
            try {
                String userId = (String) google.handleGoogleToken(token).get("sub");

                // Determining the correct time range depending on whether the current time is before or after 15:30.
                LocalDateTime date = LocalDateTime.now();
                LocalDateTime stop_date = date.minusHours(24);


                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

                //Formatting date/time to String parameters that SQL can work with it.
                String date_str = date.format(formatter);
                String stop_date_str = stop_date.format(formatter);

                String interval = "1 hour";

                List<PortfolioSnapshot> result = service.getPeriodChart(userId, date_str, stop_date_str, interval);
                System.out.println(userId + ' ' + date_str + ' ' + stop_date_str + ' ' + interval);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
            }
        }

    /**
     * Returns daily portfolio snapshot for the last 7 days
     */
    @GetMapping("/chart/weekly/{token}")
    public ResponseEntity<?> getWeeklyChart(@PathVariable("token") String token) {
        // Endpoint to retrieve the relative portfolio value for Week, sampled at a 1-day interval.
        try {
            String userId = (String) google.handleGoogleToken(token).get("sub");

            LocalDateTime date = LocalDateTime.now();
            LocalDateTime stop_date = date.minusDays(7);


            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            //Formatting date/time to String parameters that SQL can work with it.
            String date_str = date.format(formatter);
            String stop_date_str = stop_date.format(formatter);

            String interval = "1 day";

            List<PortfolioSnapshot> result = service.getPeriodChart(userId, date_str, stop_date_str, interval);
            System.out.println(userId + ' ' + date_str + ' ' + stop_date_str + ' ' + interval);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    /**
     * Returns daily portfolio snapshot for the last month
     */
    @GetMapping("/chart/monthly/{token}")
    public ResponseEntity<?> getMonthlyChart(@PathVariable("token") String token) {
        // Endpoint to retrieve the relative portfolio value for Week, sampled at a 1-day interval.
        try {
            String userId = (String) google.handleGoogleToken(token).get("sub");

            LocalDateTime date = LocalDateTime.now();
            LocalDateTime stop_date = date.minusMonths(1);


            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

            //Formatting date/time to String parameters that SQL can work with it.
            String date_str = date.format(formatter);
            String stop_date_str = stop_date.format(formatter);

            String interval = "1 day";

            List<PortfolioSnapshot> result = service.getPeriodChart(userId, date_str, stop_date_str, interval);
            System.out.println(userId + ' ' + date_str + ' ' + stop_date_str + ' ' + interval);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }
}
