package Swift.Backend.Swift.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Swift.Backend.Swift.Entities.Transaction;
import Swift.Backend.Swift.Projections.PortfolioSnapshot;
import Swift.Backend.Swift.Repositories.TransactionRepository;
import Swift.Backend.Swift.Repositories.Stock_priceRepository;

/**
 * Service for managing user transactions and portfolio calculations over different timeframes.
 */
@Service
public class TransactionService {
    public final TransactionRepository transactionRepository;
    public final Stock_priceRepository stock_priceRepository;
    

    @Autowired
    public TransactionService(TransactionRepository transactionRepository, Stock_priceRepository stock_priceRepository){
        this.transactionRepository = transactionRepository; this.stock_priceRepository = stock_priceRepository;
    }

    /**
     * Retrieves all transactions for a specific user.
     *
     * @param idUser the user ID
     * @return list of transactions
     */
    public List<Transaction> getAllTransactions(String idUser) {
        return transactionRepository.findById_user(idUser);
    }

    
    /**
     * Returns absolute portfolio snapshots over a given interval.
     *
     * @param userId the user ID
     * @param nowStr starting timestamp
     * @param stopTimeStr ending timestamp
     * @param interval time interval (e.g., hour, day)
     * @return list of portfolio snapshots
     */
    public List<PortfolioSnapshot> getPortfolioValueByTime(String userId, String nowStr, String stopTimeStr, String interval) {
        //The business logic for processing and validating the parameters is handled in the controller.
        return transactionRepository.getPortfolioSnapshots(userId, nowStr, stopTimeStr, interval);
    }

    /**
     * Returns relative portfolio snapshots (growth-based) over a given interval.
     *
     * @param userId the user ID
     * @param nowStr starting timestamp
     * @param stopTimeStr ending timestamp
     * @param interval time interval (e.g., hour, day)
     * @return list of relative portfolio snapshots
     */
    public List<PortfolioSnapshot> getRelativePortfolioValueByTime(String userId, String nowStr, String stopTimeStr, String interval) {
        //The business logic for processing and validating the parameters is handled in the controller.
        return transactionRepository.getRelativePortfolioSnapshots(userId, nowStr, stopTimeStr, interval);
    }

}