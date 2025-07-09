package com.example.aromadesk.order.dto;

import com.example.aromadesk.order.entity.Order;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
public class OrderResponseDto {
    private Long orderId;
    private LocalDateTime orderDate;
    private String orderStatus;
    private String paymentMethod;
    private int totalPrice;
    private Long deliveryId;
    private String deliveryStatus;
    private List<String> productNames;
    private String memberName;

    // 기본 from 메서드 (상품명 직접 추출)
    public static OrderResponseDto from(Order order) {
        return from(order, order.getOrderItems().stream()
                .map(item -> item.getProduct().getName())
                .collect(Collectors.toList()));
    }

    // productNames 파라미터로 받는 버전 (N+1 문제 해결용)
    public static OrderResponseDto from(Order order, List<String> productNames) {
        return OrderResponseDto.builder()
                .orderId(order.getId())
                .orderDate(order.getCreatedAt())
                .orderStatus(order.getOrderStatus().name())
                .paymentMethod(order.getPaymentMethod().name())
                .totalPrice(order.getTotalPrice())
                .deliveryId(order.getDelivery() != null ? order.getDelivery().getId() : null)
                .deliveryStatus(order.getDelivery() != null ? order.getDelivery().getStatus().name() : null)
                .productNames(productNames)
                .memberName(order.getMember().getName())
                .build();
    }

}
