package Swift.Backend.Swift.Projections;

/**
 * PortfolioView
 * 
 * Projection interface representing a summarized view of a user's portfolio entry.
 * Includes information about:
 * - Latest stock price
 * - Quantity held
 * - User and stock identifiers
 * - Total value of the holding
 */
public interface PortfolioView {

    Double getLatestPrice();
    Integer getCount();
    String getIdUser();
    Long getIdStock();
    Double getTotalValue();
}
