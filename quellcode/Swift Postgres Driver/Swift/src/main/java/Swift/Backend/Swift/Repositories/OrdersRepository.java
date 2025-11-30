package Swift.Backend.Swift.Repositories;

import Swift.Backend.Swift.Entities.Orders;
import Swift.Backend.Swift.Entities.Orders_condition;
import Swift.Backend.Swift.Projections.OrderProjection;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdersRepository extends JpaRepository<Orders, Long>{

    @Query(value = """
    SELECT o.id_order as idOrder,
           o.id_user AS idUser,
           o.id_stock AS idStock,
           o.bs AS bs,
           o.quantity AS quantity,
           o.amount AS amount,
           o.order_type AS orderType,       -- CHANGED FROM order_type
           o.created_at AS createdAt,       -- CHANGED FROM created_at
           o.updated_at AS updatedAt,       -- CHANGED FROM updated_at
           o.executed_at AS executedAt,     -- CHANGED FROM executed_at
           o.executed_price AS executedPrice, -- CHANGED FROM executed_price
           oc.limit_price AS limitPrice,
           oc.stop_price AS stopPrice
    FROM orders o
    LEFT JOIN orders_condition oc ON o.id_order = oc.id_order
    WHERE o.id_user = ?1
    """, nativeQuery = true)
List<OrderProjection> findOrdersById_user(String id_user);

Orders findOrdersById(long id);


@Query(value = "SELECT * FROM orders_condition where id_order = ?1", nativeQuery = true)
Orders_condition findByIdOrder(long idOrder);

@Transactional
@Modifying
@Query(value = "Update orders set executed_at = now(), executed_price_id = ?2, executed_price = ?3 where id_order = ?1", nativeQuery = true)
int updateExecutedOrders(long id_order, long executed_price_id, double executed_price);

@Modifying
@Query(value = "delete from orders where id_order = ?1 and executed_at is null", nativeQuery = true)
int deleteOrder(long id_order);

@Modifying
@Query(value = "delete from orders_condition where orders_condition.id_order = ?1", nativeQuery = true)
int deleteOrderCondition(long id_order);






}




