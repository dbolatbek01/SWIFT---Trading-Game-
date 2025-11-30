package Swift.Backend.Swift.Repositories;

import Swift.Backend.Swift.Entities.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Repository interface for managing Stock entities.
 * Provides basic CRUD operations and custom queries.
 */
public interface StockRepository extends JpaRepository<Stock, Long>{

    /**
     * Retrieves a stock entity by its unique identifier.
     *
     * @param id the ID of the stock to retrieve
     * @return the Stock entity matching the given ID
     */
    Stock findStockByid(long id);

    @Query(value = "SELECT * FROM public.stock WHERE id_season = " +
           "(SELECT id_season FROM public.season WHERE active_flag = true LIMIT 1)", 
           nativeQuery = true)
    List<Stock> findAllStocksFromCurrentSeason();
}