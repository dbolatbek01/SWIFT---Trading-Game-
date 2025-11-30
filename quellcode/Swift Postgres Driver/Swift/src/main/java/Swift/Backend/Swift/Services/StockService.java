package Swift.Backend.Swift.Services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Swift.Backend.Swift.Entities.Stock;
import Swift.Backend.Swift.Repositories.StockRepository;

/**
 * Service class responsible for retrieving stock-related data.
 */
@Service
public class StockService {
    public final StockRepository stockRepository;

    @Autowired
    public StockService(StockRepository stockRepository){
        this.stockRepository = stockRepository; 
    }

    /**
     * Retrieves a specific stock by its ID.
     *
     * @param IDStock the ID of the stock
     * @return the stock object found for the given ID
     */
    public Object getStock(long IDStock){
        return stockRepository.findStockByid(IDStock);
    }

    /**
     * Retrieves all available stocks.
     *
     * @return a list of all stock entities
     */
    public List<Stock> getStocks(){
        return stockRepository.findAllStocksFromCurrentSeason();
    }



}
