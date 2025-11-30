package Swift.Backend.Swift.Services;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Swift.Backend.Swift.Repositories.BankaccountRepository;

/**
 * Service class for handling operations related to bank accounts.
 * <p>
 * Provides business logic to retrieve the current worth of a user's bank account.
 */
@Service
public class BankaccountService {

    /** Repository for accessing bank account data from the database. */
    public final BankaccountRepository bankaccountRepository;

    /**
     * Constructs a {@code BankaccountService} with the required repository dependency.
     *
     * @param bankaccountRepository the repository used to access bank account data
     */
    @Autowired
    public BankaccountService(BankaccountRepository bankaccountRepository){
        this.bankaccountRepository = bankaccountRepository; 
    }

    /**
     * Retrieves the current bank account worth for a specific user and returns it in a structured map.
     *
     * @param IDUser the ID of the user whose current bank account worth is requested
     * @return a map containing the user ID and the current worth of the bank account
     */
    public Map<String, Object> getCurrentWorthBankaccount(String IDUser) {
        double currentWorth = bankaccountRepository.getCurrentWorth(IDUser);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("idUser", IDUser);
        result.put("currentWorth", currentWorth);
        return result;
    }

}
