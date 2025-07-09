package com.example.aromadesk.admin.controller;

import com.example.aromadesk.delivery.dto.DeliveryStatusResponseDto;
import com.example.aromadesk.delivery.dto.UpdateDeliveryStatusRequest;
import com.example.aromadesk.delivery.entity.DeliveryStatus;
import com.example.aromadesk.delivery.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/*************************************************************
 /* SYSTEM NAME      : Admin
 /* PROGRAM NAME     : AdminDeliveryController.java
 /* DESCRIPTION      : 관리자 배송 상태 변경 컨트롤러
 /* MODIFICATION LOG :
 /* DATE         AUTHOR          DESC.
 /*--------     ---------    ----------------------
 /* 2025.07.05   SUSU          배송 상태 변경
 /*************************************************************/

@RestController
@RequestMapping("/api/admin/delivery")
@RequiredArgsConstructor
public class AdminDeliveryController {

    private final DeliveryService deliveryService;

    /**
     * 배송 상태 변경
     *
     * @param deliveryId 배송 ID
     * @param request 배송 상태 변경 요청 DTO
     * @return 변경된 배송 상태 응답 DTO
     */
    @PostMapping("/{deliveryId}/status")
    public ResponseEntity<DeliveryStatusResponseDto> updateDeliveryStatus(
            @PathVariable Long deliveryId,
            @RequestBody UpdateDeliveryStatusRequest request) {

        DeliveryStatusResponseDto response = deliveryService.updateDeliveryStatus(
                deliveryId,
                DeliveryStatus.valueOf(request.getStatus())
        );

        return ResponseEntity.ok(response);
    }
}