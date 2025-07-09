package com.example.aromadesk.delivery.service;

import com.example.aromadesk.delivery.dto.DeliveryStatusResponseDto;
import com.example.aromadesk.delivery.entity.Delivery;
import com.example.aromadesk.delivery.entity.DeliveryStatus;

import com.example.aromadesk.delivery.repostiory.DeliveryRepository;
import com.example.aromadesk.order.entity.Order;
import com.example.aromadesk.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final OrderRepository orderRepository;
    private final DeliveryRepository deliveryRepository;

    /**
     * 배송 상태 조회
     */
    @Transactional(readOnly = true)
    public DeliveryStatus getDeliveryStatus(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다."));

        Delivery delivery = order.getDelivery();
        if (delivery == null) {
            throw new IllegalArgumentException("배송 정보가 없습니다.");
        }

        return delivery.getStatus();
    }

    /**
     * 배송 상태 변경
     */
    @Transactional
    public DeliveryStatusResponseDto updateDeliveryStatus(Long deliveryId, DeliveryStatus newStatus) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new IllegalArgumentException("배송 정보가 없습니다."));

        delivery.setStatus(newStatus);

        // 변경 결과 반환
        return DeliveryStatusResponseDto.from(delivery);
    }


    /**
     * 전체 배송 조회
     */
    @Transactional(readOnly = true)
    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.findAll();
    }
}
