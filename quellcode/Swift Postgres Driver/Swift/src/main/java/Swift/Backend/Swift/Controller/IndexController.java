package Swift.Backend.Swift.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import Swift.Backend.Swift.Googlecheck;
import Swift.Backend.Swift.Services.IndexService;

/**
 * IndexController
 * 
 * Handles all index-related endpoints, including:
 * - Loading all available indexes
 * - Fetching a specific index by ID
 * - Token authentication via Google
 */
@RestController
public class IndexController {

    // ========================
    // Dependencies
    // ========================


    private final IndexService indexService;
    private final Googlecheck google;

    /**
     * Constructor for dependency injection
     * 
     * @param indexService - Service handling index logic
     * @param google - Google token validation utility
     */
    @Autowired
    public IndexController(IndexService indexService, Googlecheck google){
        this.indexService = indexService;
        this.google = google;
    }

    // ========================
    // REST Endpoints
    // ========================

    /**
     * Loads all available index data
     * 
     * @param token - Google authentication token
     * @return List of index entities or error
     */
    @GetMapping("/loadIndexes/{token}")
    public ResponseEntity<?> loadAllIndexes(@PathVariable("token") String token){
        try {
            google.handleGoogleToken(token).get("sub");
            return ResponseEntity.ok(indexService.getIndexs());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    /**
     * Retrieves a specific index by its ID
     * 
     * @param id - Index ID
     * @param token - Google authentication token
     * @return Index data or error
     */
//    @GetMapping("/getIndex/{IDIndex}/{token}")
//     public ResponseEntity<?> getIndex(@PathVariable("IDIndex") long id, @PathVariable("token") String token){
//         try {
//            google.handleGoogleToken(token).get("sub");
//             return ResponseEntity.ok(indexService.getIndex(id));
//         } catch (Exception e) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
//         }
//     }

}
