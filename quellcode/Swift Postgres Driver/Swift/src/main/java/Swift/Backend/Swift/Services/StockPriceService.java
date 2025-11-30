package Swift.Backend.Swift.Services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Swift.Backend.Swift.DTO.StockGrowthDto;
import Swift.Backend.Swift.DTO.StockPriceDto;
import Swift.Backend.Swift.Entities.Stock_price;
import Swift.Backend.Swift.Projections.StockPriceProjection;
import Swift.Backend.Swift.Repositories.Stock_priceRepository;

/**
 * Service class for managing stock price data and related operations.
 */
@Service
public class StockPriceService {
    public final Stock_priceRepository stock_priceRepository;

    @Autowired
    public StockPriceService(Stock_priceRepository stock_priceRepository){
        this.stock_priceRepository = stock_priceRepository; 
    }

    /**
     * Retrieves the most recent stock price for a given stock ID.
     */
    public Object getCurrentStockPrice(long IDStock){
        return stock_priceRepository.findStock_pricebyIDStockOrderByDate(IDStock);
    }

    /**
     * Retrieves all stock prices for a given stock ID starting from a specific date.
     */
    public List<Stock_price> getStockPricebyPeriod(long IDStock, String date){
        return stock_priceRepository.findStock_pricebyIDStockandPeriod(IDStock, date);
    }

    /**
     * Retrieves and formats stock prices from a given start date.
     */
    public List<StockPriceDto> getStockPricesFromDate(long IDStock, String startDate) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return stock_priceRepository
            .findStock_pricebyIDStockandPeriod(IDStock, startDate).stream()
            .sorted(Comparator.comparing(Stock_price::getDate))
            .map(sp -> new StockPriceDto(
                    sp.getIdStock(),
                    sp.getId(),
                    sp.getDate().format(fmt),
                    BigDecimal.valueOf(sp.getPrice()).setScale(2, RoundingMode.HALF_UP)
            ))
            .collect(Collectors.toList());
    }

    /**
     * Calculates the stock price growth compared to the last trading day.
     */
    public List<StockGrowthDto> getStockGrowth(List<Long> stockIds) {
        List<StockGrowthDto> result = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        
        for (Long stockId : stockIds) {
           // Get current price
            Stock_price currentPrice = stock_priceRepository.findStock_pricebyIDStockOrderByDate(stockId);
            if (currentPrice == null) continue;
            
            // Determine the previous day (22:01 format like in getStockPriceByHour)
            LocalDate yesterday = now.toLocalDate().minusDays(1);
            LocalTime cutoff = LocalTime.of(15, 30, 0);
            
           // If before 15:30 today, take the day before yesterday
            if (now.toLocalTime().isBefore(cutoff)) {
                yesterday = yesterday.minusDays(1);
            }
            
           // Weekend logic: Go back to last Friday
            while (yesterday.getDayOfWeek() == DayOfWeek.SATURDAY || yesterday.getDayOfWeek() == DayOfWeek.SUNDAY) {
                yesterday = yesterday.minusDays(1);
            }
            
            LocalDateTime yesterdayDateTime = yesterday.atTime(22, 1, 0);
            String yesterdayFormatted = yesterdayDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            
            // Get price from the previous day
            List<Stock_price> yesterdayPrices = stock_priceRepository.findStock_priceByHour(stockId, yesterdayFormatted);
            if (yesterdayPrices.isEmpty()) continue;
            
           // Take the last price of the previous day
            Stock_price yesterdayPrice = yesterdayPrices.get(yesterdayPrices.size() - 1);
            
            // Calculate percent and change
            double change = currentPrice.getPrice() - yesterdayPrice.getPrice();
            double growthPercent = (change / yesterdayPrice.getPrice()) * 100.0;
            
            StockGrowthDto dto = new StockGrowthDto();
            dto.setId_stock(currentPrice.getIdStock());
            dto.setId_stock_price(currentPrice.getId());
            dto.setDatum(currentPrice.getDate());
            dto.setWert(currentPrice.getPrice());
            dto.setProcent(growthPercent);
            dto.setChange(change);
            
            result.add(dto);
        }
        
        return result;
    }

    /**
     * Retrieves stock prices by hour for a given timestamp and stock ID.
     */
    public List<Map<String, Object>> getStockPriceByHour(String dateTime, long IDStock) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"); // Create a formatter to parse the input string like "2025-06-19 14:30:00"
        LocalDateTime parsedDateTime = LocalDateTime.parse(dateTime, formatter); // Parse the input dateTime string into a LocalDateTime object
        LocalDate localDate = parsedDateTime.toLocalDate(); // Extract just the date part (e.g., 2025-06-19)
        
        LocalTime requestTime = parsedDateTime.toLocalTime(); // Extract just the time part (e.g., 14:30:00)
        LocalTime cutoff = LocalTime.of(15, 30, 0); // Define cutoff time: 15:30 (3:30 PM)
        LocalTime marketClosure = LocalTime.of(22, 0, 0); // NASDAQ closure time: 22:00 (10:oo PM)

        List<Stock_price> result;
        
        // Case 1: if it's Saturday or Sunday, or early Monday (before 15:30)
        // Then the market has not updated — we need to go back to the last working day (usually Friday)

        if (localDate.getDayOfWeek() == DayOfWeek.SATURDAY || localDate.getDayOfWeek() == DayOfWeek.SUNDAY || (localDate.getDayOfWeek() == DayOfWeek.MONDAY && requestTime.isBefore(cutoff))){
            // Keep going back one day until we find a valid weekday (not weekend, not early Monday)
            while (localDate.getDayOfWeek() == DayOfWeek.SATURDAY || localDate.getDayOfWeek() == DayOfWeek.SUNDAY || (localDate.getDayOfWeek() == DayOfWeek.MONDAY && requestTime.isBefore(cutoff))) {
                localDate = localDate.minusDays(1);
            }
            LocalDateTime dateWithTime = localDate.atTime(22, 00, 00); // Use 22:01 (10:01 PM) on that last valid day as the timestamp
            String lastFriday = dateWithTime.format(formatter);
            result = stock_priceRepository.findStock_priceByHour(IDStock, lastFriday); // Convert it to string and query the database
        } else if (requestTime.isBefore(cutoff)) { // Case 2: if it's a weekday but still before 15:30, use the previous day's 22:01
            LocalDateTime dateWithTime = localDate.atTime(22, 00, 00);
            String lastDay = dateWithTime.minusDays(1).format(formatter);
            result = stock_priceRepository.findStock_priceByHour(IDStock, lastDay);
        } else if (requestTime.isAfter(marketClosure)) { // Case 3: it's after 22:00 on a weekday — we use the data from the last trading hour
            LocalDateTime dateWithTime = localDate.atTime(22, 00, 00);
            String CurrentDay = dateWithTime.format(formatter);
            result = stock_priceRepository.findStock_priceByHour(IDStock, CurrentDay);
        } else { // Case 4: it's after 15:30 on a weekday — we use the input timestamp directly
            result = stock_priceRepository.findStock_priceByHour(IDStock, parsedDateTime.format(formatter));
        }
        
        // Convert the list of stock prices into a list of maps with "value" and "date"
        return result.stream()
            .map(sp -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("value", sp.getPrice()); // Put the price
                m.put("date", sp.getDate()); // Put the datetime
                return m;
            }).collect(Collectors.toList()); // Return the list of maps
    }

    
    /**
     * Retrieves stock prices for a specific day.
     */
    public List<Map<String, Object>> getStockPriceByDay(String dateTime, long IDStock) {
        LocalDate localDate = LocalDate.parse(dateTime); // Parse the input date string (in format yyyy-MM-dd) into a LocalDate object 
        LocalDateTime now = LocalDateTime.now(); // Get the current date and time
    
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"); // Create a formatter to parse the input string like "2025-06-19 14:30:00"
        LocalTime cutoff = LocalTime.of(15, 30, 0); // Define the cutoff time — 15:30 (3:30 PM)

        List<Stock_price> result;
        
        // Case 1: if it's Saturday or Sunday, or early Monday (before 15:30)
        // Then the market has not updated — we need to go back to the last working day (usually Friday)

        if (localDate.getDayOfWeek() == DayOfWeek.SATURDAY || localDate.getDayOfWeek() == DayOfWeek.SUNDAY || (localDate.getDayOfWeek() == DayOfWeek.MONDAY && now.toLocalTime().isBefore(cutoff))) {
            // Keep going back one day until we find a valid weekday (not weekend, not early Monday)
            while (localDate.getDayOfWeek() == DayOfWeek.SATURDAY || localDate.getDayOfWeek() == DayOfWeek.SUNDAY || (localDate.getDayOfWeek() == DayOfWeek.MONDAY && now.toLocalTime().isBefore(cutoff))) {
            localDate = localDate.minusDays(1);
            }
            LocalDateTime dateWithTime = localDate.atTime(23, 1, 0); // Use 23:01 (11:01 PM) on that last valid day as the timestamp
            String lastFriday = dateWithTime.format(formatter);
            result = stock_priceRepository.findStock_priceByDay(IDStock, lastFriday); // Convert it to string and query the database
        } else {
            if (localDate.equals(LocalDate.now())) { // Case 2: If the given date is today
                if (now.toLocalTime().isBefore(cutoff)) { // And it's before the cutoff time
                    LocalDateTime dateWithTime = localDate.atTime(23, 1, 0); // Use the previous day's data
                    String lastDay = dateWithTime.minusDays(1).format(formatter);
                    result = stock_priceRepository.findStock_priceByDay(IDStock, lastDay);
                } else { // Case 3: it's after 15:30 on a weekday — we use the input timestamp directly
                    result = stock_priceRepository.findStock_priceByDay(IDStock, now.format(formatter));
                }
            } else { // Case 4: If the given date is not today, simply use that date at 23:01:00
                LocalDateTime dateWithTime = localDate.atTime(23, 1, 0);
                String formatted = dateWithTime.format(formatter);
                result = stock_priceRepository.findStock_priceByDay(IDStock, formatted);
            }
        }
        
        // Convert the list of Index_prices into a list of maps with "value" and "date"
        return result.stream()
            .map(sp -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("value", sp.getPrice()); // Put the price
                m.put("timestamp", sp.getDate()); // Put the datetime
                return m;
            }).collect(Collectors.toList()); // Return the list of maps
}

    /**
     * Retrieves stock prices aggregated by week.
     */
    public List<Map<String, Object>> getStockPriceByWeek(String date, long IDStock) {
        return stock_priceRepository.findStock_priceByWeek(IDStock, date).stream()
            .map(sp -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("idStock", sp.getIdStock());
                m.put("value", sp.getPrice());
                m.put("timestamp", sp.getDate());
                return m;
            }).collect(Collectors.toList());
    }

    /**
     * Retrieves stock prices aggregated by month.
     */
    public List<Map<String, Object>> getStockPriceByMonth(String date, long IDStock) {
        return stock_priceRepository.findStock_priceByMonth(IDStock, date).stream()
            .map(sp -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("idStock", sp.getIdStock());
                m.put("value", sp.getPrice());
                m.put("timestamp", sp.getDate());
                return m;
            }).collect(Collectors.toList());
    }

    public List<StockPriceProjection> getStockPriceByTime(long id, String startTs, String endTs, String interval) {
        //The business logic for processing and validating the parameters is handled in the controller.
        return stock_priceRepository.findStockPriceByTime(id, startTs, endTs, interval);
    }
}
