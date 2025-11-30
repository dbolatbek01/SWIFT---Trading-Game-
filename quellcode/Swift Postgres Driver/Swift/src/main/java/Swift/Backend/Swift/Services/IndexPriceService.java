package Swift.Backend.Swift.Services;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Swift.Backend.Swift.Entities.Index_prices;
import Swift.Backend.Swift.Projections.IndexPriceProjection;
import Swift.Backend.Swift.Repositories.Index_pricesRepository;

/**
 * Service class for retrieving and processing index price data over different timeframes (hourly, daily, weekly, monthly).
 * 
 * Contains logic to handle market-related edge cases such as weekends and cutoff times for daily updates.
 */
@Service
public class IndexPriceService {

    /** Repository for accessing index price data. */
    public final Index_pricesRepository index_pricesRepository;

    /**
     * Constructs an {@code IndexPriceService} with a required {@link Index_pricesRepository} dependency.
     *
     * @param index_pricesRepository the repository used for accessing index price data
     */
    @Autowired
    public IndexPriceService(Index_pricesRepository index_pricesRepository){
        this.index_pricesRepository = index_pricesRepository; 
    }

    /**
     * Retrieves index prices by the hour, handling weekend and early-day cutoffs.
     * 
     * If the request is during the weekend or before market update (15:30), the method adjusts the date accordingly.
     *
     * @param dateTime the date and time in "yyyy-MM-dd HH:mm:ss" format
     * @return a list of maps containing "value" and "date" entries
     */
    public List<Map<String, Object>> getIndexValueByHour(String dateTime) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"); // Create a formatter to parse the input string like "2025-06-19 14:30:00"
        LocalDateTime parsedDateTime = LocalDateTime.parse(dateTime, formatter);  // Parse the input dateTime string into a LocalDateTime object
        LocalDate localDate = parsedDateTime.toLocalDate(); // Extract just the date part (e.g., 2025-06-19)
        
        LocalTime requestTime = parsedDateTime.toLocalTime(); // Extract just the time part (e.g., 14:30:00)
        LocalTime cutoff = LocalTime.of(15, 30, 0); // Define cutoff time: 15:30 (3:30 PM)

        List<Index_prices> result;
        
        // Case 1: if it's Saturday or Sunday, or early Monday (before 15:30)
        // Then the market has not updated — we need to go back to the last working day (usually Friday)
        
        if (localDate.getDayOfWeek() == DayOfWeek.SATURDAY || localDate.getDayOfWeek() == DayOfWeek.SUNDAY || (localDate.getDayOfWeek() == DayOfWeek.MONDAY && requestTime.isBefore(cutoff))){
            // Keep going back one day until we find a valid weekday (not weekend, not early Monday)
            while (localDate.getDayOfWeek() == DayOfWeek.SATURDAY || localDate.getDayOfWeek() == DayOfWeek.SUNDAY || (localDate.getDayOfWeek() == DayOfWeek.MONDAY && requestTime.isBefore(cutoff))) {
                localDate = localDate.minusDays(1);
            }
            LocalDateTime dateWithTime = localDate.atTime(22, 01, 00);  // Use 22:01 (10:01 PM) on that last valid day as the timestamp
            String lastFriday = dateWithTime.format(formatter);
            result = index_pricesRepository.findIndex_ValueByHour(lastFriday); // Convert it to string and query the database
        } else if (requestTime.isBefore(cutoff)) { // Case 2: if it's a weekday but still before 15:30, use the previous day's 22:01
            LocalDateTime dateWithTime = localDate.atTime(22, 01, 00);
            String lastDay = dateWithTime.minusDays(1).format(formatter);
            result = index_pricesRepository.findIndex_ValueByHour(lastDay);
        } else { // Case 3: it's after 15:30 on a weekday — we use the input timestamp directly
            result = index_pricesRepository.findIndex_ValueByHour(parsedDateTime.format(formatter));
        }
        
        // Convert the list of Index_prices into a list of maps with "value" and "date"
        return result.stream()
            .map(sp -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("value", sp.getPrice()); // Put the price
                m.put("date", sp.getDatetime()); // Put the datetime
                return m;
            }).collect(Collectors.toList()); // Return the list of maps
    }

    /**
     * Retrieves index prices by day, accounting for weekends and market cutoff time (15:30).
     * <p>
     * If the input date is today and before cutoff, it uses data from the previous day.
     *
     * @param dateTime the date in "yyyy-MM-dd" format
     * @param id the ID of the index
     * @return a list of maps containing "value" and "date" entries
     */
    public List<Map<String, Object>> getIndexValueByDay(String dateTime, long id) {
        LocalDate localDate = LocalDate.parse(dateTime);// Parse the input date string (in format yyyy-MM-dd) into a LocalDate object 

        LocalDateTime now = LocalDateTime.now();// Get the current date and time
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");// Create a formatter to parse the input string like "2025-06-19 14:30:00"

        LocalTime cutoff = LocalTime.of(15, 30,0);// Define the cutoff time — 15:30 (3:30 PM)
        
        // Case 1: if it's Saturday or Sunday, or early Monday (before 15:30)
        // Then the market has not updated — we need to go back to the last working day (usually Friday)

        List<Index_prices> result;
        
        if (localDate.getDayOfWeek() == DayOfWeek.SATURDAY || localDate.getDayOfWeek() == DayOfWeek.SUNDAY || (localDate.getDayOfWeek() == DayOfWeek.MONDAY && now.toLocalTime().isBefore(cutoff))){
            // Keep going back one day until we find a valid weekday (not weekend, not early Monday)
            while (localDate.getDayOfWeek() == DayOfWeek.SATURDAY || localDate.getDayOfWeek() == DayOfWeek.SUNDAY || (localDate.getDayOfWeek() == DayOfWeek.MONDAY && now.toLocalTime().isBefore(cutoff))) {
                localDate = localDate.minusDays(1);
            }
            LocalDateTime dateWithTime = localDate.atTime(23, 01, 00); // Use 23:01 (11:01 PM) on that last valid day as the timestamp
            String lastFriday = dateWithTime.format(formatter);
            result = index_pricesRepository.findIndex_ValueByDay(id, lastFriday);// Convert it to string and query the database
        } else {
            if (localDate.equals(LocalDate.now())) { // Case 2: If the given date is today
                if (now.toLocalTime().isBefore(cutoff)) {  // And it's before the cutoff time
                    LocalDateTime dateWithTime = localDate.atTime(23, 01, 00); // Use the previous day's data
                    String lastDay = dateWithTime.minusDays(1).format(formatter);
                    result = index_pricesRepository.findIndex_ValueByDay(id, lastDay);
                } else { // Case 3: If the given date is not today, simply use that date at 23:01:00
                    result = index_pricesRepository.findIndex_ValueByDay(id, now.format(formatter));
                }
                ;
            } else {
                result = index_pricesRepository.findIndex_ValueByDay(id, localDate.atTime(23, 01, 00).format(formatter));
            }
        }
        
        // Convert the list of Index_prices into a list of maps with "value" and "date"
        return result.stream()
            .map(sp -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("value", sp.getPrice()); // Put the price
                m.put("date", sp.getDatetime()); // Put the datetime
                return m;
            }).collect(Collectors.toList()); // Return the list of maps
    }

    /**
     * Retrieves index values for the past week.
     * 
     * Returns one entry per day using the latest price available on each date.
     *
     * @param dateTime the reference timestamp (ISO format)
     * @param id the ID of the index
     * @return a list of maps with "idIndex", "value", and "date"
     */
     public List<Map<String, Object>> getIndexValueByWeek(String dateTime, long id) {
        return index_pricesRepository.findIndex_ValueByWeek(id, dateTime).stream()
            .map(sp -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("idIndex", sp.getIdIndex());
                m.put("value", sp.getPrice());
                m.put("date", sp.getDatetime());
                return m;
            }).collect(Collectors.toList());
    }

    /**
     * Retrieves index values for the past month.
     * 
     * Returns one entry per day using the latest price available on each date.
     *
     * @param dateTime the reference timestamp (ISO format)
     * @param id the ID of the index
     * @return a list of maps with "idIndex", "value", and "date"
     */
    public List<Map<String, Object>> getIndexValueByMonth(String dateTime, long id) {
        return index_pricesRepository.findIndex_ValueByMonth(id, dateTime).stream()
            .map(sp -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("idIndex", sp.getIdIndex());
                m.put("value", sp.getPrice());
                m.put("date", sp.getDatetime());
                return m;
            }).collect(Collectors.toList());
    }
    
    public List<IndexPriceProjection> getIndexValueByTime(String startTs, String endTs, String interval) {
        //The business logic for processing and validating the parameters is handled in the controller.
        return index_pricesRepository.findIndexValueByTime(startTs, endTs, interval);
    }
}
