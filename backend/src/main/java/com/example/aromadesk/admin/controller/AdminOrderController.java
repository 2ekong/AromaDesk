package com.example.aromadesk.admin.controller;

import com.example.aromadesk.order.dto.OrderDetailResponseDto;
import com.example.aromadesk.order.dto.OrderResponseDto;
import com.example.aromadesk.order.entity.Order;
import com.example.aromadesk.order.repository.OrderRepository;
import com.example.aromadesk.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<Page<OrderResponseDto>> getAllOrdersForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<OrderResponseDto> result = orderService.getAllOrdersForAdmin(pageRequest);

        return ResponseEntity.ok(result);
    }


    /**
     * 주문 상세 조회 (배송 정보 포함)
     *
     * @param orderId 주문 ID
     * @return 주문 상세 정보 응답 DTO
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDetailResponseDto> getOrderDetail(@PathVariable Long orderId) {
        OrderDetailResponseDto response = orderService.getOrderDetail(orderId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{orderId}/order-status")
    public ResponseEntity<Void> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> body) {

        String orderStatus = body.get("orderStatus");
        orderService.updateOrderStatus(orderId, orderStatus);
        return ResponseEntity.ok().build();
    }


}
