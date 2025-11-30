package Swift.Backend.Swift.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import Swift.Backend.Swift.Entities.User_service;

/**
 * Repository interface for accessing and managing user service data.
 * 
 * This interface extends JpaRepository, providing basic CRUD operations
 * for the User_service entity, where the primary key type is String.
 */
public interface UserRepository extends JpaRepository<User_service, String> {
    // You can define custom query methods here if needed
}