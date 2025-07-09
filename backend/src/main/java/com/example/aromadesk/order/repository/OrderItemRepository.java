package com.example.aromadesk.order.repository;

import com.example.aromadesk.order.dto.OrderProductNameDto;
import com.example.aromadesk.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository  extends JpaRepository<OrderItem, Long> {
    @Query("select new com.example.aromadesk.order.dto.OrderProductNameDto(oi.order.id, p.name) " +
            "from OrderItem oi join oi.product p " +
            "where oi.order.id in :orderIds")
    List<OrderProductNameDto> findOrderProductNamesByOrderIds(@Param("orderIds") List<Long> orderIds);

}
