package Swift.Backend.Swift.Controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import Swift.Backend.Swift.Googlecheck;
import Swift.Backend.Swift.Entities.Transaction;
import Swift.Backend.Swift.Projections.PortfolioSnapshot;
import Swift.Backend.Swift.Services.TransactionService;

/**
 * TransactionController
 * 
 * Handles all endpoints related to user transactions and portfolio history.
 * - Fetches all transactions
 * - Retrieves portfolio states by hour, day, week, and month
 * - Computes both absolute and relative portfolio values
 */
@RestController
public class TransactionController {

    // ========================
    // Dependencies
    // ========================

    private final TransactionService transactionService;
    private final Googlecheck google;

    /**
     * Constructor for dependency injection
     */
    @Autowired
    public TransactionController(TransactionService transactionService, Googlecheck google){
        this.transactionService = transactionService;
        this.google = google;
    }

    // ========================
    // REST Endpoints
    // ========================

    /**
     * Returns all transactions for the authenticated user
     */
    @GetMapping("/getAllTransactions/{token}")
    public ResponseEntity<?> getAllTransactions(@PathVariable("token") String token) {
        try {
            String userId = (String) google.handleGoogleToken(token).get("sub");
            List<Transaction> txs = transactionService.getAllTransactions(userId);
            if (txs.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(txs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }


    /** Portfolio absolute values for different timeframes **/

    @GetMapping("/getPortfolioValueToday/{token}")
    public ResponseEntity<?> getPortfolioValueToday(@PathVariable("token") String token) {
        try {
            String userId = (String) google.handleGoogleToken(token).get("sub");

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime stop_time = now.minusHours(24);
            //LocalDateTime stop_time = now.withHour(15).withMinute(30).withSecond(0).withNano(0);

            LocalDateTime date;
            LocalDateTime stop_date;
            


            /*if (now.isBefore(stop_time)) {
                // Vor 15:30 → Vortag
                date = now.minusDays(1).withHour(0).withMinute(0).withSecond(0).withNano(0);
                stop_date = date.withHour(15).withMinute(30).withSecond(0).withNano(0);
            } else {*/
                date = now;
                stop_date = stop_time;
            /* }*/

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String date_str = date.format(formatter);
            String stop_date_str = stop_date.format(formatter);

            String interval = "1 hour";

            List<PortfolioSnapshot> result = transactionService.getPortfolioValueByTime(userId, date_str, stop_date_str, interval);
            System.out.println(userId + ' ' + date_str + ' ' + stop_date_str + ' ' + interval);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    @GetMapping("/getPortfolioValueLastWeek/{token}")
    public ResponseEntity<?> getPortfolioValueLastWeek(@PathVariable("token") String token) {
        try {
            String userId = (String) google.handleGoogleToken(token).get("sub");

            LocalDateTime date = LocalDateTime.now();
            LocalDateTime stop_date = date.minusHours(168);
            
            //LocalDateTime date = LocalDateTime.now();
            //LocalDateTime stop_date = date.minusDays(7);


            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String date_str = date.format(formatter);
            String stop_date_str = stop_date.format(formatter);

            String interval = "1 day";

            List<PortfolioSnapshot> result = transactionService.getPortfolioValueByTime(userId, date_str, stop_date_str, interval);
            System.out.println(userId + ' ' + date_str + ' ' + stop_date_str + ' ' + interval);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    @GetMapping("/getPortfolioValueLastMonth/{token}")
    public ResponseEntity<?> getPortfolioValueLastMonth(@PathVariable("token") String token) {
        try {
            String userId = (String) google.handleGoogleToken(token).get("sub");

            LocalDateTime date = LocalDateTime.now();
            LocalDateTime stop_date = date.minusHours(720);

            //LocalDateTime date = LocalDateTime.now();
            //LocalDateTime stop_date = date.minusMonths(1);


            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String date_str = date.format(formatter);
            String stop_date_str = stop_date.format(formatter);

            String interval = "1 day";

            List<PortfolioSnapshot> result = transactionService.getPortfolioValueByTime(userId, date_str, stop_date_str, interval);
            System.out.println(userId + ' ' + date_str + ' ' + stop_date_str + ' ' + interval);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    /** Portfolio relative values for different timeframes **/

    @GetMapping("/getRelativePortfolioValueToday/{token}")
    public ResponseEntity<?> getRelativePortfolioValueToday(@PathVariable("token") String token) {
        // Endpoint to retrieve the relative portfolio value for today, sampled at a 1-hour interval.
        try {
            String userId = (String) google.handleGoogleToken(token).get("sub");

            // Determining the correct time range depending on whether the current time is before or after 15:30.
            LocalDateTime now = LocalDateTime.now();
            //LocalDateTime stop_time = now.withHour(16).withMinute(30).withSecond(0).withNano(0);

            LocalDateTime date;
            LocalDateTime stop_date;

            /*if (now.isBefore(stop_time)) {
                // Before 15:30 → use previous day
                date = now.minusDays(1).withHour(23).withMinute(0).withSecond(0).withNano(0);
                stop_date = date.withHour(15).withMinute(30).withSecond(0).withNano(0);
            } else {
                date = now;
                stop_date = stop_time;
            }*/

            date = now;
            stop_date = date.minusDays(1);

            //Formatting date/time to String parameters that SQL can work with it.
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String date_str = date.format(formatter);
            String stop_date_str = stop_date.format(formatter);

            String interval = "1 hour";

            List<PortfolioSnapshot> result = transactionService.getRelativePortfolioValueByTime(userId, date_str, stop_date_str, interval);
            System.out.println(userId + ' ' + date_str + ' ' + stop_date_str + ' ' + interval);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    @GetMapping("/getRelativePortfolioValueLastWeek/{token}")
    public ResponseEntity<?> getRelativePortfolioValueLastWeek(@PathVariable("token") String token) {
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

            List<PortfolioSnapshot> result = transactionService.getRelativePortfolioValueByTime(userId, date_str, stop_date_str, interval);
            System.out.println(userId + ' ' + date_str + ' ' + stop_date_str + ' ' + interval);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    @GetMapping("/getRelativePortfolioValueLastMonth/{token}")
    public ResponseEntity<?> getRelativePortfolioValueLastMonth(@PathVariable("token") String token) {
        // Endpoint to retrieve the relative portfolio value for today, sampled at a 1-day interval.
        try {
            String userId = (String) google.handleGoogleToken(token).get("sub");

            LocalDateTime date = LocalDateTime.now();
            LocalDateTime stop_date = date.minusMonths(1);


            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
             //Formatting date/time to String parameters that SQL can work with it.
            String date_str = date.format(formatter);
            String stop_date_str = stop_date.format(formatter);

            String interval = "1 day";

            List<PortfolioSnapshot> result = transactionService.getRelativePortfolioValueByTime(userId, date_str, stop_date_str, interval);
            System.out.println(userId + ' ' + date_str + ' ' + stop_date_str + ' ' + interval);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }
}
