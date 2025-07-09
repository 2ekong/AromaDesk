package com.example.aromadesk.delivery.dto;

import lombok.Getter;
import lombok.Setter;

/*************************************************************
 /* SYSTEM NAME      : Delivery
 /* PROGRAM NAME     : UpdateDeliveryStatusRequest.java
 /* DESCRIPTION      : 배송 상태 변경 요청 DTO
 /* MODIFICATION LOG :
 /* DATE         AUTHOR          DESC.
 /*--------     ---------    ----------------------
 /* 2025.07.05   SUSU          배송 상태 변경 요청
 /*************************************************************/

@Getter
@Setter
public class UpdateDeliveryStatusRequest {
    private String status;
}
