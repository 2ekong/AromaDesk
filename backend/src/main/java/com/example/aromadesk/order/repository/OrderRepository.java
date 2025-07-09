package com.example.aromadesk.order.repository;

import com.example.aromadesk.order.dto.OrderItemDto;
import com.example.aromadesk.order.dto.OrderProductNameDto;
import com.example.aromadesk.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByMemberId(Long memberId);

    @Query("SELECT SUM(oi.price * oi.quantity) FROM Order o JOIN o.orderItems oi " +
            "WHERE o.createdAt >= :start AND o.createdAt < :end AND o.orderStatus = 'PAID'")
    Long getTotalSalesBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("SELECT o.orderStatus, COUNT(o) FROM Order o WHERE o.createdAt >= :start AND o.createdAt < :end GROUP BY o.orderStatus")
    List<Object[]> countOrdersByStatusBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query(
            value = "select o from Order o join fetch o.delivery d join fetch o.member m",
            countQuery = "select count(o) from Order o"
    )
    Page<Order> findAllWithDeliveryAndMember(Pageable pageable);

    @Query("SELECT new com.example.aromadesk.order.dto.OrderProductNameDto(oi.order.id, p.name) " +
            "FROM OrderItem oi " +
            "JOIN oi.product p " +
            "WHERE oi.order.id IN :orderIds")
    List<OrderProductNameDto> findOrderProductNamesByOrderIds(@Param("orderIds") List<Long> orderIds);

    @Query("SELECT o FROM Order o JOIN FETCH o.delivery WHERE o.id = :orderId")
    Optional<Order> findWithDeliveryById(@Param("orderId") Long orderId);


}
