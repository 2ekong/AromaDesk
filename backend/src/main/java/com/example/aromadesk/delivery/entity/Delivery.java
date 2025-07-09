package com.example.aromadesk.delivery.entity;

import com.example.aromadesk.order.entity.Order;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 주문 연관 관계
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    /**
     * 배송 주소
     */
    @Column(nullable = false, length = 255)
    private String address;

    /**
     * 배송 상태 (Enum으로 관리)
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DeliveryStatus status = DeliveryStatus.PREPARING; // 기본값

    /**
     * 운송장 번호
     */
    @Column(length = 100)
    private String trackingNumber;

    /**
     * 수정일시 (업데이트 자동 반영)
     */
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
