package Swift.Backend.Swift.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Swift.Backend.Swift.Entities.Index;
import Swift.Backend.Swift.Repositories.IndexRepository;

/**
 * Service class for managing operations related to {@link Index} entities.
 * <p>
 * Provides methods for retrieving a single index by ID or fetching all available indices.
 */
@Service
public class IndexService {

    /** Repository used for accessing index data from the database. */
    public final IndexRepository indexRepository;

    /**
     * Constructs an {@code IndexService} with a required {@link IndexRepository} dependency.
     *
     * @param indexRepository the repository used to access index data
     */
    @Autowired
    public IndexService(IndexRepository indexRepository){
        this.indexRepository = indexRepository; 
    }

    /**
     * Retrieves a specific index entity by its ID.
     *
     * @param IDIndex the ID of the index
     * @return the index entity wrapped in an {@code Optional}, or empty if not found
     */
//    public Object getIndex(long IDIndex){
//            return indexRepository.findById(IDIndex);
//        }

    /**
     * Retrieves all index entities from the database.
     *
     * @return a list of all {@link Index} entities
     */
    public Index getIndexs(){
       return indexRepository.findIndexFromCurrentSeason(); 
    }
}
