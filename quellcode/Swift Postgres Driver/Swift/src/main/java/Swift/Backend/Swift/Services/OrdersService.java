package Swift.Backend.Swift.Services;

import org.springframework.stereotype.Service;
//import Swift.Backend.Swift.Services.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import Swift.Backend.Swift.DTO.OrderRequestDTO;
import Swift.Backend.Swift.Entities.Orders;
import Swift.Backend.Swift.Entities.Transaction;
import Swift.Backend.Swift.Projections.OrderProjection;
import Swift.Backend.Swift.Entities.Orders_condition;
import Swift.Backend.Swift.Repositories.OrdersRepository;
import Swift.Backend.Swift.Repositories.Orders_conditionRepository;
import Swift.Backend.Swift.Repositories.PortfolioRepository;
import Swift.Backend.Swift.Repositories.Stock_priceRepository;

@Service
public class OrdersService {
    public final OrdersRepository ordersRepository;
    public final Orders_conditionRepository orders_conditionRepository;
    public final Stock_priceRepository stock_priceRepository;
    public final PortfolioRepository portfolioRepository;

    public final Swift.Backend.Swift.Services.Service service;

    @Autowired
    public OrdersService(OrdersRepository ordersRepository, Orders_conditionRepository orders_conditionRepository, 
    Stock_priceRepository stock_priceRepository, PortfolioRepository portfolioRepository,
    Swift.Backend.Swift.Services.Service service){
        this.ordersRepository = ordersRepository; this.orders_conditionRepository = orders_conditionRepository;  
        this.stock_priceRepository = stock_priceRepository; this.portfolioRepository = portfolioRepository; this.service = service;
    }

    public Orders saveOrder(String idUser, OrderRequestDTO orderRequestDTO){
        LocalDateTime now = LocalDateTime.now();

        if ("Market".equalsIgnoreCase(orderRequestDTO.getOrderType())){
            if (orderRequestDTO.getLimitPrice() != 0 || orderRequestDTO.getStopPrice() != 0){
                throw new IllegalArgumentException("limit or stop_prices are not allowed by order_type: MARKET");
            } 
        } else if ("STOP".equalsIgnoreCase(orderRequestDTO.getOrderType())){
            if (orderRequestDTO.getLimitPrice() != 0 || orderRequestDTO.getStopPrice() == null || orderRequestDTO.getStopPrice() == 0){
                throw new IllegalArgumentException("stop_price has to be > 0 and limit_price has to be 0 by order_type: STOP");
            } 
        } else if ("LIMIT".equalsIgnoreCase(orderRequestDTO.getOrderType())){
            if (orderRequestDTO.getLimitPrice() == null || orderRequestDTO.getStopPrice() != 0 || orderRequestDTO.getLimitPrice() == 0){
                throw new IllegalArgumentException("limit_price has to be > 0 and stop_price has to be 0 by order_type: LIMIT");
            }
        }
        if (
            (orderRequestDTO.getQuantity() == 0 && orderRequestDTO.getAmount() == 0) || 
            (orderRequestDTO.getQuantity() != 0 && orderRequestDTO.getAmount() != 0)
        ){
            throw new IllegalArgumentException("Either quantity or amount must be set – not both and not neither.");
        }

        Orders order = new Orders(
            idUser,
            orderRequestDTO.getIdStock(),
            orderRequestDTO.getBs(),
            orderRequestDTO.getQuantity(), // 
            orderRequestDTO.getAmount(), // 
            orderRequestDTO.getOrderType(),
            now, // createdAt = jetzt
            now  // updatedAt = jetzt
        );



        Orders savedOrder = ordersRepository.save(order);

        if (orderRequestDTO.getLimitPrice() != null && orderRequestDTO.getStopPrice() != null) {
            Orders_condition orders_condition = new Orders_condition(
                savedOrder.getId(),
                orderRequestDTO.getLimitPrice(),
                orderRequestDTO.getStopPrice()
            );
            orders_conditionRepository.save(orders_condition);
        }

        return savedOrder;
    }

    public List<OrderProjection> getAllOrders(String idUser) {
        System.out.println(ordersRepository.findOrdersById_user(idUser));
        return ordersRepository.findOrdersById_user(idUser);
    }

    public long executeOrder(long idOrder){

        Orders order = ordersRepository.findOrdersById(idOrder);
        Orders_condition orders_condition = ordersRepository.findByIdOrder(idOrder);

        var latestStockPrice = stock_priceRepository.getLatestStockPrice(order.getIdStock());
        double stockPrice = latestStockPrice.getPrice();

        if (order.getAmount() > 0){
            double amount = order.getAmount();
            Long quantity = (long) Math.floor(amount / stockPrice);
            order.setQuantity(quantity);
        }

        String orderType = order.getOrderType().toUpperCase();
        
        switch (orderType) {
            case "LIMIT":
                double limitPrice = orders_condition.getLimitPrice();
                if(order.getBs() == false && stockPrice > limitPrice){
                    throw new IllegalArgumentException("current_stock_price higher as the Limit-Buy_price");

                } else if (order.getBs() == true && stockPrice < limitPrice){
                        throw new IllegalArgumentException("current_stock_price not higher as the Limit-Sell_price");
                }
                break;

            case "STOP":
                double stopPrice = orders_condition.getStopPrice();
                if(order.getBs() == false && stockPrice < stopPrice){
                    throw new IllegalArgumentException("current_stock_price lower as the Stop-Buy_price");
                } else if (order.getBs() == true && stockPrice > stopPrice){
                    throw new IllegalArgumentException("current_stock_price higher as the Stop-Sell_price");
                } 
                break;

            default:
                break;
        }

        Transaction transaction = new Transaction(order.getIdStock(), (long) order.getQuantity());

        try {
            if (order.getBs() == false){
                service.buyStock(order.getIdUser(), transaction);
            } else {
                Long quantity_owned_stock = portfolioRepository.getCountofStock(order.getIdStock(), order.getIdUser());
                if (quantity_owned_stock < order.getQuantity()){
                    order.setQuantity(quantity_owned_stock);
                }
                service.sellStock(order.getIdUser(), transaction);
            }
            ordersRepository.updateExecutedOrders(idOrder,  stock_priceRepository.getLatestStockPrice(order.getIdStock()).getIdStockPrice(),  stockPrice);
            
        } catch (Exception e) {
            throw new IllegalStateException("Order Execution canceled, here is why: " + e.getMessage());
        }
        
        return order.getId();
    }

    @Transactional
    public long deleteOrders(long id_order, String idUser){
        //Orders order = ordersRepository.findOrdersById(id_order);
        //String id_User = order.getIdUser();


        //System.out.println("id_order: " + id_order + " idUser: " + idUser);
        //System.out.println("id_order: " + id_order + " (" + ((Object) id_order).getClass().getName() + ")");
        //System.out.println("idUser (aus Token): " + idUser + " (" + ((Object) idUser).getClass().getName() + ")");
        //System.out.println("id_User (aus Order): " + id_User + " (" + ((Object) id_User).getClass().getName() + ")");
        /*if (order.getExecutedAt() != null || !idUser.equals(id_User)){
            throw new IllegalArgumentException("deleting executed orders or orders that not belong to to this User is not allowed!");
        }
        if (!order.getOrderType().equalsIgnoreCase("MARKET")){
            ordersRepository.deleteOrderCondition(id_order);
        }*/
        ordersRepository.deleteOrderCondition(id_order);
        ordersRepository.deleteOrder(id_order);

        return 1;
    }

}


