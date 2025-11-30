package Swift.Backend.Swift.Services;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import Swift.Backend.Swift.Entities.Bankaccount;
import Swift.Backend.Swift.Entities.Index;
import Swift.Backend.Swift.Entities.Index_prices;
import Swift.Backend.Swift.Entities.Portfolio;
import Swift.Backend.Swift.Entities.Transaction;
import Swift.Backend.Swift.Projections.PortfolioSnapshot;
import Swift.Backend.Swift.Projections.PortfolioView;
import Swift.Backend.Swift.Projections.StockPriceProjection;
import Swift.Backend.Swift.Repositories.BankaccountRepository;
import Swift.Backend.Swift.Repositories.ChartRepository;
import Swift.Backend.Swift.Repositories.IndexRepository;
import Swift.Backend.Swift.Repositories.Index_pricesRepository;
import Swift.Backend.Swift.Repositories.PortfolioRepository;
import Swift.Backend.Swift.Repositories.PortfolioRepository.PortfolioGroup;
import Swift.Backend.Swift.Repositories.Stock_priceRepository;
import Swift.Backend.Swift.Repositories.TransactionRepository;
import jakarta.transaction.Transactional;

/**
 * Core service class providing logic for buying/selling stocks, 
 * computing portfolio performance, and managing account balances.
 */
@org.springframework.stereotype.Service
public class Service {
    public final Stock_priceRepository stock_priceRepository;
    public final TransactionRepository transactionRepository;
    public final PortfolioRepository portfolioRepository;
    public final BankaccountRepository bankaccountRepository;
    public final IndexRepository indexRepository; 
    public final Index_pricesRepository index_pricesRepository;
    public final ChartRepository chartRepository;

    /**
     * Constructor injecting all necessary repositories.
     */
    @Autowired
    public Service(Stock_priceRepository stock_priceRepository, TransactionRepository transactionRepository, PortfolioRepository portfolioRepository, 
    BankaccountRepository bankaccountRepository, IndexRepository indexRepository, Index_pricesRepository index_pricesRepository, ChartRepository chartRepository){
        this.stock_priceRepository = stock_priceRepository; this.transactionRepository = transactionRepository; 
        this.portfolioRepository = portfolioRepository; this.bankaccountRepository = bankaccountRepository;this.indexRepository = indexRepository; this.index_pricesRepository = index_pricesRepository;
        this.chartRepository = chartRepository;
    }

    /**
     * Computes the current growth of an index based on the last day's closing price.
     *
     * @param IDIndex the index ID
     * @return a map with index name, growth percentage, and current date
     */
    public Map<String, Object> getCurrentIndexGrowth(long IDIndex){
        Map<String, Object> result = new LinkedHashMap<>();

        Index index = indexRepository.findById(IDIndex).orElse(null);
        String indexName = index.getIndexname();

        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        String today = now.format(formatter);

        double lastDayValue = index_pricesRepository.findIndex_ValuebyIDLastPriceDayBefore(IDIndex, today).getPrice();

        Index_prices currentPrice = index_pricesRepository.findIndex_ValuebyIDOrderByDate(IDIndex);
        double currentValue = currentPrice.getPrice();
        LocalDateTime date = currentPrice.getDatetime();

        double growth = ((currentValue - lastDayValue)/lastDayValue) * 100;
        
        result.put("index", indexName);
        result.put("current index growth", String.format("%+.2f%%", growth));
        result.put("date", date); 
        
        return result;
    }

    /**
     * Handles the logic for purchasing a stock.
     *
     * @param idUser the ID of the user making the purchase
     * @param transaction the transaction details
     * @return the completed transaction object
     */
    @Transactional
    public Transaction buyStock(String idUser, Transaction transaction){
        // Executes the logic for buying a stock for a specific user.
        /* Business Logic Summary:
         * - Retrieves the latest stock price for the given stock.
         * - Checks if the user has sufficient funds to complete the purchase.
         * - Optionally restricts trading to weekdays between 16:30 and 22:00 (currently commented out).
         * - Updates the user's bank account balance.
         * - Creates portfolio entries for each stock unit purchased.
         * - Records the transaction details and persists all relevant entities. */

        transaction.setIdUser(idUser);

        // Get the latest price for the selected stock
        StockPriceProjection stockPriceProjection = stock_priceRepository.getLatestStockPrice(transaction.getIdStock());
        System.out.println("ID: " + stockPriceProjection.getIdStockPrice() + ", Price: " + stockPriceProjection.getPrice());
        
        // Retrieve user's current account balance
        double current_worth = bankaccountRepository.getCurrentWorth(transaction.getIdUser());
        double stock_price = stockPriceProjection.getPrice();
        double new_worth = current_worth - stock_price * transaction.getCount();

        // Check if user has enough Money to buy the requested number of stocks
        if (new_worth <= 0) {
            throw new IllegalStateException("Nicht genug Guthaben auf dem Bankkonto.");
        }

        // Get current date and time
        LocalDateTime now = LocalDateTime.now();
        //LocalTime nowTime = now.toLocalTime();
        //DayOfWeek nowDay = now.getDayOfWeek();

        // Define trading restrictions (weekends and off-hours)
        //boolean isWeekend = nowDay == DayOfWeek.SATURDAY || nowDay == DayOfWeek.SUNDAY;
        //boolean isOutsideTime = nowTime.isBefore(LocalTime.of(16, 30)) || nowTime.isAfter(LocalTime.of(22, 0));

        /*if (isWeekend || isOutsideTime) {
            throw new IllegalStateException("Aktionen sind nur von Montag bis Freitag zwischen 16:30 und 22:00 Uhr möglich.");
        }*/

        // Create a new bank account object with updated balance
        Bankaccount bankaccount = new Bankaccount(
        transaction.getIdUser(),
        current_worth,
        new_worth);

        // Create one portfolio entry per stock unit bought
        List<Portfolio> portfolios = new ArrayList<>();
        for (int i = 0; i < transaction.getCount(); i++) {
        Portfolio portfolio = new Portfolio(
                transaction.getIdUser(),
                stockPriceProjection.getIdStockPrice(),
                transaction.getIdStock(),
                1, // one unit per record
                stock_price,
                now
            );
            portfolios.add(portfolio);
        }

        // Set missing transaction details
        transaction.setIdStockPrice(stockPriceProjection.getIdStockPrice());
        transaction.setValue(stock_price);
        transaction.setDate(now);
        transaction.setBs(false);

        // Persist transaction, portfolio entries, and updated bank account
        saveAll(transaction, portfolios, bankaccount);

        return(transaction);
    }

    @Transactional
    public Transaction sellStock(String idUser, Transaction transaction){
        //Executes the logic for selling a stock for a specific user.
        /*Business Logic Summary:
        * - Retrieves the latest stock price for the given stock.
        * - Validates that the user owns enough shares to sell.
        * - Optionally restricts trading to weekdays between 16:30 and 22:00 (currently commented out).
        * - Updates the user's bank account balance.
        * - Removes the sold shares from the portfolio.
        * - Records the transaction and persists all relevant entities. */
        transaction.setIdUser(idUser);

        // Get the latest stock price
        StockPriceProjection stockPriceProjection = stock_priceRepository.getLatestStockPrice(transaction.getIdStock());
        System.out.println("ID: " + stockPriceProjection.getIdStockPrice() + ", Price: " + stockPriceProjection.getPrice());
        
        // calculate new balance
        double current_worth = bankaccountRepository.getCurrentWorth(transaction.getIdUser());
        double stock_price = stockPriceProjection.getPrice();
        double new_worth = current_worth + stock_price * transaction.getCount();

        // Check how many shares the user currently owns
        //long current_stock_count = portfolioRepository.getStockCountByIDs(transaction.getIdStock(), transaction.getIdUser());
        System.out.println(transaction.getCount());

        /*if (current_stock_count < transaction.getCount()) {
            throw new IllegalStateException("Es wird versucht mehr Aktien zu verkaufen als im Portfolio überhaupt vorhanden sind!");
        }*/

        // Get current date and time
        LocalDateTime now = LocalDateTime.now();
        //LocalTime nowTime = now.toLocalTime();
        //DayOfWeek nowDay = now.getDayOfWeek();


        // Define trading restrictions (weekends and off-hours)
        //boolean isWeekend = nowDay == DayOfWeek.SATURDAY || nowDay == DayOfWeek.SUNDAY;
        //boolean isOutsideTime = nowTime.isBefore(LocalTime.of(16, 30)) || nowTime.isAfter(LocalTime.of(22, 0));

        /*if (isWeekend || isOutsideTime) {
            throw new IllegalStateException("Aktionen sind nur von Montag bis Freitag zwischen 16:30 und 22:00 Uhr möglich.");
        }*/

        // Create updated bank account entry with increased balance
        Bankaccount bankaccount = new Bankaccount(
        transaction.getIdUser(),
        current_worth,
        new_worth);

        // Set missing transaction details
        transaction.setIdStockPrice(stockPriceProjection.getIdStockPrice());
        transaction.setValue(stock_price);
        transaction.setDate(now);
        transaction.setBs(true);

        // Save transaction and bank account update
        transactionRepository.save(transaction);
        bankaccountRepository.save(bankaccount);
        //portfolioRepository.deleteByIDAndCount(transaction.getIdStock(), transaction.getIdUser(), transaction.getCount());

        // Remove sold shares from the user's portfolio
        int deletedRows = portfolioRepository.deleteByIDAndCount(
            transaction.getIdStock(),
            transaction.getIdUser(),
            transaction.getCount()
        );

        System.out.println("Es wurden " + deletedRows + " Portfolio-Einträge gelöscht.");

        // Validate that the correct number of portfolio entries were removed
        if (deletedRows < transaction.getCount()) {
            throw new IllegalStateException("Es wird versucht mehr Aktien zu verkaufen als im Portfolio überhaupt vorhanden sind!");
        }

        return(transaction);
    }

    /**
     * Saves a transaction, list of portfolio entries, and bank account update in a single transactional context.
     *
     * @param transaction the transaction entity
     * @param portfolios list of portfolio entries
     * @param bankaccount the bank account entity
     */
    @Transactional
    public void saveAll(Transaction transaction, List<Portfolio> portfolios, Bankaccount bankaccount) {
        //Addition to buyStock & SellStock Routes
        transactionRepository.save(transaction);
        transactionRepository.flush();
        portfolioRepository.saveAll(portfolios);
        bankaccountRepository.save(bankaccount);
    }

    /**
     * Retrieves the current portfolio for a user with the latest stock prices.
     *
     * @param idUser the ID of the user
     * @return a list of {@link PortfolioView} projections
     */
    public List<PortfolioView> getCurrentPortfolioGroups(String idUser){
        return portfolioRepository.findUserPortfolioWithLatestPrices(idUser);
    }

    /**
     * Retrieves grouped portfolio data for a specific user.
     *
     * @param idUser the user ID
     * @return a list of {@link PortfolioGroup} projections
     */
    public List<PortfolioRepository.PortfolioGroup> getPortfolioGroups(String idUser){
        return portfolioRepository.findPortfolioGroupByIdUser(idUser);
    }


    /**
     * Retrieves the total portfolio value history for a user over a given period and interval.
     *
     * @param userId the user ID
     * @param nowStr the start time
     * @param stopTimeStr the end time
     * @param interval the interval (e.g. '1 day', '1 hour')
     * @return list of {@link PortfolioSnapshot} entries representing performance over time
     */
    public List<PortfolioSnapshot> getPeriodChart(String userId, String nowStr, String stopTimeStr, String interval) {
        return chartRepository.findPeriodPerformance(userId, nowStr, stopTimeStr, interval);
    }

}
