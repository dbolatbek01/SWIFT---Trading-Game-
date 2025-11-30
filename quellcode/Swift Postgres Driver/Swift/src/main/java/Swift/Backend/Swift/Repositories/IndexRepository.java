package Swift.Backend.Swift.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import Swift.Backend.Swift.Entities.Index;

/**
 * Repository interface for accessing Index entities from the database.
 * 
 * This interface extends JpaRepository to inherit basic CRUD operations such as:
 * - findById
 * - findAll
 * - save
 * - deleteById
 * 
 * You can also define custom queries here if needed in the future.
 */
public interface IndexRepository extends JpaRepository<Index, Long>{

    @Query(value = "SELECT * FROM public.index WHERE id_season = " +
       "(SELECT id_season FROM public.season WHERE active_flag = true LIMIT 1) " +
       "LIMIT 1", 
       nativeQuery = true)
    Index findIndexFromCurrentSeason();
   
}
