package Swift.Backend.Swift.Controller;

import Swift.Backend.Swift.Googlecheck;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;

import Swift.Backend.Swift.DTO.OrderRequestDTO;
import Swift.Backend.Swift.Services.OrdersService;

@RestController
public class OrdersController {

    private final OrdersService ordersService;
    private final Googlecheck google;

    @Autowired
    public OrdersController(OrdersService ordersService, Googlecheck google){
    this.ordersService = ordersService; this.google = google;
    }

    @PostMapping("/createOrder/{token}")
    public ResponseEntity<?> createOrder(@PathVariable("token") String token, @RequestBody OrderRequestDTO orderRequestDTO){
        try {
            String idUser = (String) google.handleGoogleToken(token).get("sub");
            return ResponseEntity.ok(ordersService.saveOrder(idUser, orderRequestDTO));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    @GetMapping("/getAllOrders/{token}")
    public ResponseEntity<?> getAllOrders(@PathVariable("token") String token) {
        try {
            String userId = (String) google.handleGoogleToken(token).get("sub");
            return ResponseEntity.ok(ordersService.getAllOrders(userId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    @PostMapping("/executeOrder/{idOrder}/{Passwort}")
    public ResponseEntity<?> executeOrder(@PathVariable("idOrder") long idOrder, @PathVariable("Passwort") String pw){
        System.out.println(pw);
        try {
            if (!"suprsecretpasswort".equals(pw)){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("nice Try Lukas!, but no");
            } else {
                return ResponseEntity.ok(ordersService.executeOrder(idOrder));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }
    }

    @DeleteMapping("deleteOrder/{idOrder}/{token}")
    public ResponseEntity<?> deleteOrder(@PathVariable("idOrder") long idOrder, @PathVariable("token") String token){
        try {
            String userId = (String) google.handleGoogleToken(token).get("sub");
            return ResponseEntity.ok(ordersService.deleteOrders(idOrder, userId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token ungültig oder Fehler: " + e.getMessage());
        }

    }
}
