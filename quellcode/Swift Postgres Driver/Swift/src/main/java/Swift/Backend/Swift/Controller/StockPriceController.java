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
import Swift.Backend.Swift.Projections.StockPriceProjection;
import Swift.Backend.Swift.Services.StockPriceService;

/**
 * StockPriceController
 * 
 * Handles endpoints related to stock price data:
 * - Current prices
 * - Historical data by time period
 * - Growth calculation for multiple stocks
 * 
 * All endpoints require Google token authentication.
 */
@RestController
public class StockPriceController {

    // ========================
    // Dependencies
    // ========================

    private final StockPriceService stockPriceService;
    private final Googlecheck google;

    /**
     * Constructor for dependency injection
     */
    @Autowired
    public StockPriceController(StockPriceService stockPriceService, Googlecheck google){
        this.stockPriceService = stockPriceService;
        this.google = google;
    }

    // ========================
    // REST Endpoints
    // ========================

    /**
     * Returns the current stock price for a given stock ID
     */
    @GetMapping("/getcurrentStockPrice/{IDStock}/{token}")
    public ResponseEntity<?> getCurrentStockPrice(@PathVariable("IDStock") long IDStock, @PathVariable("token") String token){
        try {
            google.handleGoogleToken(token);
            return ResponseEntity.ok(stockPriceService.getCurrentStockPrice(IDStock));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    /**
     * Returns stock prices for a given period
     */
    @GetMapping("/getStockPricesByPeriod/{IDStock}/{date}/{token}")
    public ResponseEntity<?> getStockPricebyPeriod(
            @PathVariable("IDStock") long IDStock,
            @PathVariable("date") String date,  @PathVariable("token") String token) {
        try {
            google.handleGoogleToken(token);
            return ResponseEntity.ok(stockPriceService.getStockPricebyPeriod(IDStock, date));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    /**
     * Returns stock prices from a given start date
     */
    @GetMapping("/getStockPricesFromDate/{IDStock}/{startDate}/{token}")
    public ResponseEntity<?> getStockPricesFromDate(
            @PathVariable("IDStock") long IDStock,
            @PathVariable("startDate") String startDate,  @PathVariable("token") String token) {
                try {
                google.handleGoogleToken(token);
                return ResponseEntity.ok(stockPriceService.getStockPricesFromDate(IDStock, startDate));
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
                }
    }

    /**
     * Returns the growth of a list of stocks based on current and historical values
     */
    @PostMapping("/getStockGrowth/{token}")
    public ResponseEntity<?> getStockGrowth(@PathVariable("token") String token, @RequestBody List<Long> stockIds){
        try {
            google.handleGoogleToken(token).get("sub");
            return ResponseEntity.ok(stockPriceService.getStockGrowth(stockIds));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    @GetMapping("/getStockPriceLastHour/{id}/{token}")
    public ResponseEntity<?> getStockPriceLastHour(@PathVariable("id") long IDStock, @PathVariable("token") String token){
        try {
            google.handleGoogleToken(token).get("sub");

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime stop_time = now.minusHours(1);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String stop_date_str = now.format(formatter);
            String date_str = stop_time.format(formatter);

            String interval = "1 minute";

            List<StockPriceProjection> result = stockPriceService.getStockPriceByTime(IDStock, date_str, stop_date_str, interval);
            System.out.println(IDStock + ' ' + date_str + ' ' + stop_date_str + ' ' + interval);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }      
    }

    @GetMapping("/getStockPriceToday/{id}/{token}")
    public ResponseEntity<?> getStockPriceToday(@PathVariable("id") long IDStock, @PathVariable("token") String token){
        try {
            google.handleGoogleToken(token).get("sub");

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime stop_time = now.minusHours(24);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String stop_date_str = now.format(formatter);
            String date_str = stop_time.format(formatter);

            String interval = "1 hour";

            List<StockPriceProjection> result = stockPriceService.getStockPriceByTime(IDStock, date_str, stop_date_str, interval);
            System.out.println(IDStock + ' ' + date_str + ' ' + stop_date_str + ' ' + interval);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }      
    }

    @GetMapping("/getStockPriceLastWeek/{id}/{token}")
    public ResponseEntity<?> getStockPriceLastWeek(@PathVariable("id") long IDStock, @PathVariable("token") String token){
        try {
            google.handleGoogleToken(token).get("sub");

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime stop_time = now.minusHours(168);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String stop_date_str = now.format(formatter);
            String date_str = stop_time.format(formatter);

            String interval = "1 day";

            List<StockPriceProjection> result = stockPriceService.getStockPriceByTime(IDStock, date_str, stop_date_str, interval);
            System.out.println(IDStock + ' ' + date_str + ' ' + stop_date_str + ' ' + interval);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }      
    }

    @GetMapping("/getStockPriceLastMonth/{id}/{token}")
    public ResponseEntity<?> getStockPriceLastMonth(@PathVariable("id") long IDStock, @PathVariable("token") String token){
        try {
            google.handleGoogleToken(token).get("sub");

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime stop_time = now.minusHours(720);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String stop_date_str = now.format(formatter);
            String date_str = stop_time.format(formatter);

            String interval = "1 day";

            List<StockPriceProjection> result = stockPriceService.getStockPriceByTime(IDStock, date_str, stop_date_str, interval);
            System.out.println(IDStock + ' ' + date_str + ' ' + stop_date_str + ' ' + interval);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }      
    }
}
