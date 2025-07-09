package com.example.aromadesk.delivery.controller;

import com.example.aromadesk.delivery.dto.DeliveryStatusResponseDto;
import com.example.aromadesk.delivery.entity.Delivery;
import com.example.aromadesk.delivery.entity.DeliveryStatus;
import com.example.aromadesk.delivery.service.DeliveryService;
import com.example.aromadesk.order.entity.Order;
import com.example.aromadesk.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService deliveryService;

    /**
     * 특정 주문의 배송 상태 조회
     */
    @GetMapping("/orders/{orderId}/status")
    public ResponseEntity<DeliveryStatusResponseDto> getDeliveryStatus(@PathVariable Long orderId) {
        DeliveryStatus status = deliveryService.getDeliveryStatus(orderId);

        DeliveryStatusResponseDto response = DeliveryStatusResponseDto.builder()
                .deliveryId(orderId)
                .status(status.name())
                .build();

        return ResponseEntity.ok(response);
    }


    /**
     * 배송 상태 변경
     */
    @PutMapping("/{deliveryId}/status/{newStatus}")
    public ResponseEntity<String> updateDeliveryStatus(@PathVariable Long deliveryId, @PathVariable String newStatus) {
        deliveryService.updateDeliveryStatus(deliveryId, DeliveryStatus.valueOf(newStatus));
        return ResponseEntity.ok("배송 상태가 변경되었습니다.");
    }

    /**
     * 전체 배송 조회
     */
    @GetMapping
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }
}
