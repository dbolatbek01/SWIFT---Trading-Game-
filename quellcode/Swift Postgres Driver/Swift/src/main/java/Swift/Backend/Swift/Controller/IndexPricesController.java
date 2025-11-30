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
import Swift.Backend.Swift.Projections.IndexPriceProjection;
import Swift.Backend.Swift.Services.IndexPriceService;

/**
 * IndexPricesController
 * 
 * Handles index value retrieval over different timeframes:
 * - Hourly
 * - Daily
 * - Weekly
 * - Monthly
 * 
 * All endpoints are authenticated using a Google token.
 */
@RestController
public class IndexPricesController {

    // ========================
    // Dependencies
    // ========================

    private final IndexPriceService indexPriceService;
    private final Googlecheck google;

    /**
     * Constructor for dependency injection
     * 
     * @param indexPriceService - Service for index price data
     * @param google - Google token validation utility
     */
    @Autowired
    public IndexPricesController(IndexPriceService indexPriceService, Googlecheck google){
        this.indexPriceService = indexPriceService;
        this.google = google;
    }

    // ========================
    // REST Endpoints
    // ========================

    /**
     * Retrieves hourly index value data for a given index and time
     * 
     * @param dateTime - Timestamp string
     * @param id - Index ID
     * @param token - Google authentication token
     * @return Index value data or error
     */
    @GetMapping("/getIndexValueByHour/{dateTime}/{token}")
        public ResponseEntity<?> getIndexValueByHour(
                @PathVariable("dateTime") String dateTime,
                @PathVariable("token") String token) {
                try{
                    google.handleGoogleToken(token).get("sub");
                    return ResponseEntity.ok(indexPriceService.getIndexValueByHour(dateTime));
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
                }
        }

    @GetMapping("/getIndexValueToday/{token}")
    public ResponseEntity<?> getIndexValueToday(@PathVariable("token") String token){
        try {
            google.handleGoogleToken(token).get("sub");

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime stop_time = now.minusHours(24);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String stop_date_str = now.format(formatter);
            String date_str = stop_time.format(formatter);

            String interval = "1 hour";

            List<IndexPriceProjection> result = indexPriceService.getIndexValueByTime(date_str, stop_date_str, interval);
            System.out.println(date_str + ' ' + stop_date_str + ' ' + interval);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }      
    }

    @GetMapping("/getIndexValueLastWeek/{token}")
    public ResponseEntity<?> getIndexValueLastWeek(@PathVariable("token") String token){
        try {
            google.handleGoogleToken(token).get("sub");

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime stop_time = now.minusHours(168);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String stop_date_str = now.format(formatter);
            String date_str = stop_time.format(formatter);

            String interval = "1 day";

            List<IndexPriceProjection> result = indexPriceService.getIndexValueByTime(date_str, stop_date_str, interval);
            System.out.println(date_str + ' ' + stop_date_str + ' ' + interval);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }      
    }

    @GetMapping("/getIndexValueLastMonth/{token}")
    public ResponseEntity<?> getIndexValueLastMonth(@PathVariable("token") String token){
        try {
            google.handleGoogleToken(token).get("sub");

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime stop_time = now.minusHours(720);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String stop_date_str = now.format(formatter);
            String date_str = stop_time.format(formatter);

            String interval = "1 day";

            List<IndexPriceProjection> result = indexPriceService.getIndexValueByTime(date_str, stop_date_str, interval);
            System.out.println(date_str + ' ' + stop_date_str + ' ' + interval);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }      
    }
}    
