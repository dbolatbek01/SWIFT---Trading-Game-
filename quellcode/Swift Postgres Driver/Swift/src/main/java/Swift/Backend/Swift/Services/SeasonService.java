package Swift.Backend.Swift.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Swift.Backend.Swift.Entities.Season;
import Swift.Backend.Swift.Repositories.SeasonRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SeasonService {
    public final SeasonRepository seasonRepository;

    @Autowired
    public SeasonService(SeasonRepository seasonRepository){
        this.seasonRepository = seasonRepository;
    }

    @Transactional(rollbackFor = Exception.class)
    public Season runSeasonChange() {
        try {
            seasonRepository.callPersistLeaderboard();
            seasonRepository.callSwitchActiveSeason();
            seasonRepository.callResetBankaccount();
            seasonRepository.callDropOrders();
            seasonRepository.callDropTransaction();
            seasonRepository.callDropPortfolio();
            seasonRepository.callDropStockPrice();
            seasonRepository.callDropIndexPrice();

            return seasonRepository.getActiveSeason();
        } catch (Exception e) {
            System.out.println("Failed to change season: " + e.getMessage());
            throw new RuntimeException("Failed to change season: " + e.getMessage(), e);
        }
    }
}