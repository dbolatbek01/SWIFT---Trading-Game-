package Swift.Backend.Swift;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import Swift.Backend.Swift.Entities.User_service;
import Swift.Backend.Swift.Repositories.UserRepository;
import Swift.Backend.Swift.Entities.Bankaccount;
import Swift.Backend.Swift.Repositories.BankaccountRepository;
import Swift.Backend.Swift.Repositories.SeasonRepository;

@org.springframework.stereotype.Service
public class Googlecheck {
    @Autowired
    public final UserRepository userRepository;
    public final BankaccountRepository bankaccountRepository;
    public final SeasonRepository seasonRepository;

    @Autowired
    public Googlecheck(UserRepository userRepository, BankaccountRepository bankaccountRepository, SeasonRepository seasonRepository){
        this.userRepository = userRepository;
        this.bankaccountRepository = bankaccountRepository;
        this.seasonRepository = seasonRepository;
    }

    /**
     * Handles the Google OAuth token by either simulating a user (if token is '1234-swift')
     * or by making a real API call to Google's userinfo endpoint to fetch user data.
     *
     * @param token the OAuth token provided by the frontend
     * @return a LinkedHashMap containing the user's Google profile information
     */
    @SuppressWarnings("rawtypes")
    public LinkedHashMap handleGoogleToken(String token) {
        if (!token.equals("1234-swift"))
        {
            // Set HTTP proxy
            System.setProperty("http.proxyHost", "proxy.th-wildau.de");
            System.setProperty("http.proxyPort", "8080");

            // Set HTTPS proxy
            System.setProperty("https.proxyHost", "proxy.th-wildau.de");
            System.setProperty("https.proxyPort", "8080");

            String url = "https://www.googleapis.com/oauth2/v3/userinfo";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<Map> response = new RestTemplate().exchange(
                    url,
                    HttpMethod.GET,
                    request,
                    Map.class
            );
                
            return (LinkedHashMap) response.getBody();
        } else {
            // Return simulated user data for local development/testing
            Map<String, String> exampleJson = new LinkedHashMap<>();
            exampleJson.put("sub","1");
            exampleJson.put("name","swift");
            exampleJson.put("picture","testbild");
            exampleJson.put("email","test@mail.de");
            exampleJson.put("given_name","swiftie");

            return (LinkedHashMap) exampleJson;
        }
    }

    /**
     * Handles the login or registration of a user after Google authentication.
     * If the user already exists, their data is returned.
     * Otherwise, a new user and default bank account are created.
     *
     * @param googleUser a LinkedHashMap containing Google user data
     * @return a User_service object representing the logged-in or newly registered user
     */
    @SuppressWarnings("rawtypes")
    public User_service handleUserLogin(LinkedHashMap googleUser) {
        Optional<User_service> existingUser = userRepository.findById(googleUser.get("sub").toString());

        User_service user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            user = new User_service(null, null, null, null, null);
            user.setId(googleUser.get("sub").toString());
            user.setName(googleUser.get("name").toString());
            user.setProfilePicture(googleUser.get("picture").toString());
            user.setEmail(googleUser.get("email").toString());
            user.setUsername(googleUser.get("given_name").toString());
            user = userRepository.save(user);

            Double startWorth = (double) seasonRepository.getActiveSeason().getStartBalance();

            Bankaccount bankaccount = new Bankaccount();
            bankaccount.setId(0);
            bankaccount.setIdUser(googleUser.get("sub").toString());
            bankaccount.setStartWorth(startWorth);
            bankaccount.setCurrentWorth(startWorth);
            bankaccount = bankaccountRepository.save(bankaccount);
        }
            
        return user;      
    }
}