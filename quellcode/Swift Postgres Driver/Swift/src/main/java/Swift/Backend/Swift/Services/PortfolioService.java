package Swift.Backend.Swift.Services;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import Swift.Backend.Swift.Repositories.PortfolioRepository;

/**
 * Service class for handling operations related to user portfolios.
 * 
 * Provides methods to retrieve grouped portfolio data and portfolio value snapshots over a defined period.
 */
@Service
public class PortfolioService {

    /** Repository for accessing portfolio-related data from the database. */

    public final PortfolioRepository portfolioRepository;

    /**
     * Constructs a {@code PortfolioService} with a required {@link PortfolioRepository} dependency.
     *
     * @param portfolioRepository the repository used to access portfolio data
     */
    @Autowired
    public PortfolioService(PortfolioRepository portfolioRepository){
        this.portfolioRepository = portfolioRepository; 
    }

    /**
     * Retrieves grouped portfolio data for a specific user.
     * 
     * The result includes aggregated values such as count and average value per stock.
     *
     * @param idUser the ID of the user
     * @return a list of {@link PortfolioRepository.PortfolioGroup} projections
     */
    public List<PortfolioRepository.PortfolioGroup> getPortfolioGroups(String idUser){
        return portfolioRepository.findPortfolioGroupByIdUser(idUser);
 
    }

    /**
     * Retrieves the total value of a user's portfolio up to a specified cutoff date.
     * 
     * The result includes the user ID, the calculated total value, and the cutoff date.
     *
     * @param idUser the ID of the user
     * @param date the cutoff date (inclusive) as a string
     * @return a map containing the user's portfolio value details
     */
    public Map<String, Object> getPortfolioValueByPeriod(String idUser, String date){
        PortfolioRepository.PortfolioSnapshot portfolio = portfolioRepository.findPortfolioByPeriod(idUser, date);
        Map<String, Object> result = new LinkedHashMap<>();

        result.put("idUser", portfolio.getIdUser());
        result.put("totalValue", portfolio.getTotalValue());
        result.put("cutoff date", date);

        return result;
        
    }

}
