package com.example.aromadesk.cart.dto;

import com.example.aromadesk.order.entity.PaymentMethod;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/*************************************************************
 /* SYSTEM NAME      : CART
 /* PROGRAM NAME     : CartRequestDto.class
 /* DESCRIPTION      : 장바구니 기반 주문 생성 요청 DTO
 /* MODIFIVATION LOG :
 /* DATA         AUTHOR          DESC.
 /*--------     ---------    ----------------------
 /*2025.06.25   SUSU        INITIAL RELEASE
 /*************************************************************/


@Getter
@Setter
public class CartRequestDto {
    private List<Long> cartItemIds;
    private Long deliveryId;
    private PaymentMethod paymentMethod;
}