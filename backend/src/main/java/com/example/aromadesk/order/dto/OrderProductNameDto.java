package com.example.aromadesk.order.dto;

public class OrderProductNameDto {
    private Long orderId;
    private String productName;

    public OrderProductNameDto(Long orderId, String productName) {
        this.orderId = orderId;
        this.productName = productName;
    }

    public Long getOrderId() {
        return orderId;
    }

    public String getProductName() {
        return productName;
    }
}