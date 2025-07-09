package com.example.aromadesk.order.dto;

import com.example.aromadesk.order.entity.Order;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/*************************************************************
 /* SYSTEM NAME      : Order
 /* PROGRAM NAME     : OrderDetailResponseDto.java
 /* DESCRIPTION      : 주문 상세 조회 응답 DTO
 /* MODIFICATION LOG :
 /* DATE         AUTHOR          DESC.
 /*--------     ---------    ----------------------
 /*2025.07.05   SUSU           주문 상세 조회 응답 생성
 /*2025.07.08   SUSU           배송지 추가
 /*************************************************************/

@Getter
@Setter
@Builder
public class OrderDetailResponseDto {
    private Long orderId;
    private String memberId;
    private LocalDateTime orderDate;
    private String status;              // ✔ 수정 (orderStatus → status)
    private String paymentMethod;       // ✔ 추가
    private String deliveryStatus;
    private int totalPrice;
    private String address;
    private Long deliveryId;
    private String deliveryAddress;

    public static OrderDetailResponseDto from(Order order) {
        return OrderDetailResponseDto.builder()
                .orderId(order.getId())
                .memberId(order.getMember().getMemberId())
                .orderDate(order.getCreatedAt())
                .status(order.getOrderStatus().name())              // ✔ 수정
                .paymentMethod(order.getPaymentMethod().name())    // ✔ 추가
                .deliveryStatus(order.getDelivery() != null ? order.getDelivery().getStatus().name() : null)
                .totalPrice(order.getTotalPrice())
                .address(order.getDelivery() != null ? order.getDelivery().getAddress() : null)
                .deliveryId(order.getDelivery() != null ? order.getDelivery().getId() : null)
                .deliveryAddress(order.getDelivery() != null ? order.getDelivery().getAddress() : null)
                .build();
    }
}
