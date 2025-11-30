package Swift.Backend.Swift.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import Swift.Backend.Swift.Entities.Stock_price;

/**
 * Repository interface for accessing and managing Stock_price entities.
 * 
 * This interface inherits standard CRUD operations from JpaRepository
 * for Stock_price objects using Long as the ID type.
 */
public interface Stock_pricesRepository extends JpaRepository<Stock_price, Long>{

    // Currently no custom queries are defined.
    // Extend this interface with custom query methods if needed.  
}
    
