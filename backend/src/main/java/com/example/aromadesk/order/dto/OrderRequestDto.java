package com.example.aromadesk.order.dto;

import com.example.aromadesk.order.entity.PaymentMethod;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequestDto {
    private List<OrderItemDto> items;
    private Long deliveryId;
    private PaymentMethod paymentMethod;

    private String address;
    private List<Long> cartItemIds;
}
