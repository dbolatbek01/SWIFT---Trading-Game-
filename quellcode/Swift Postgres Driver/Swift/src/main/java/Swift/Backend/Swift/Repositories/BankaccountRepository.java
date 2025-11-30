package Swift.Backend.Swift.Repositories;


import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;

import Swift.Backend.Swift.Entities.Bankaccount;

/**
 * Repository interface for accessing {@link Bankaccount} entities from the database.
 * Extends {@link JpaRepository} to provide basic CRUD operations and custom queries.
 */
public interface BankaccountRepository extends JpaRepository<Bankaccount, Long>{

    /**
     * Retrieves the most recent value of {@code current_worth} for the user with the given ID.
     * <p>
     * This query selects the latest bank account entry (based on {@code id_bankaccount} in descending order)
     * for the specified user and returns its {@code current_worth}.
     *
     * @param IDUser the unique identifier of the user
     * @return the current worth of the user's most recent bank account
     */
    @Query(value = "SELECT current_worth FROM bankaccount WHERE id_user = ?1 ORDER BY id_bankaccount DESC LIMIT 1" , nativeQuery = true)
    double getCurrentWorth(String IDUser);
    
}
