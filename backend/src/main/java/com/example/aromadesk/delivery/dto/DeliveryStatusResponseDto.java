package com.example.aromadesk.delivery.dto;

import com.example.aromadesk.delivery.entity.Delivery;
import com.sun.jdi.request.ThreadDeathRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Builder
public class DeliveryStatusResponseDto {
    private Long deliveryId;
    private String status;

    /**
     * Delivery → DTO 변환
     */
    public static DeliveryStatusResponseDto from(Delivery delivery) {
        return DeliveryStatusResponseDto.builder()
                .deliveryId(delivery.getId())
                .status(delivery.getStatus().name())
                .build();
    }
}
