package Swift.Backend.Swift.Repositories;

import Swift.Backend.Swift.Entities.Season;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;

public interface SeasonRepository extends JpaRepository<Season, Long> {
    @Query(value = "SELECT * FROM season", nativeQuery = true)
    List<Season> getAllSeasons();

    @Query(value = "SELECT * FROM season WHERE active_flag = true", nativeQuery = true)
    Season getActiveSeason();

    @Modifying
    @Query(value = "CALL public.persist_leaderboard()", nativeQuery = true)
    void callPersistLeaderboard();

    @Modifying
    @Query(value = "CALL public.switch_active_season()", nativeQuery = true)
    void callSwitchActiveSeason();

    @Modifying
    @Query(value = "CALL public.drop_index_price()", nativeQuery = true)
    void callDropIndexPrice();

    @Modifying
    @Query(value = "CALL public.drop_stock_price()", nativeQuery = true)
    void callDropStockPrice();

    @Modifying
    @Query(value = "CALL public.drop_portfolio()", nativeQuery = true)
    void callDropPortfolio();

    @Modifying
    @Query(value = "CALL public.drop_orders()", nativeQuery = true)
    void callDropOrders();

    @Modifying
    @Query(value = "CALL public.reset_bankaccount()", nativeQuery = true)
    void callResetBankaccount();

    @Modifying
    @Query(value = "CALL public.drop_transaction()", nativeQuery = true)
    void callDropTransaction();
}
