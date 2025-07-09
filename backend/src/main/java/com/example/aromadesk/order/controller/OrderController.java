package com.example.aromadesk.order.controller;

import com.example.aromadesk.auth.service.CustomOAuth2User;
import com.example.aromadesk.auth.service.MemberLoginService;
import com.example.aromadesk.delivery.dto.DeliveryStatusResponseDto;
import com.example.aromadesk.delivery.entity.Delivery;
import com.example.aromadesk.member.entity.Member;
import com.example.aromadesk.order.dto.OrderDetailResponseDto;
import com.example.aromadesk.order.dto.OrderRequestDto;
import com.example.aromadesk.order.dto.OrderResponseDto;
import com.example.aromadesk.order.entity.Order;
import com.example.aromadesk.order.repository.OrderRepository;
import com.example.aromadesk.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/*************************************************************
 /* SYSTEM NAME      : Order
 /* PROGRAM NAME     : OrderController.class
 /* DESCRIPTION      : 주문 생성 및 조회 API 컨트롤러
 /* MODIFIVATION LOG :
 /* DATA         AUTHOR          DESC.
 /*--------     ---------    ----------------------
 /*2025.06.25   SUSU        상품 상세보기 및 장바구니 주문 처리
 /*2025.06.26   SUSU        결제 완료 처리
 /*2025.06.30   SUSU        로그인 사용자 타입 분기 처리 로직 추가
 /*2025.06.30   SUSU        단일 상품 주문 수정
 /*2025.07.03   SUSU        배송 조회 API 추가
 /*************************************************************/

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderRepository orderRepository;

    /**
     * 인증된 사용자로부터 Member 객체 추출 (OAuth2 또는 일반 로그인)
     */
    private Member extractLoginMember() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomOAuth2User) {
            return ((CustomOAuth2User) principal).getMember();
        } else if (principal instanceof MemberLoginService.CustomUserDetails) {
            return ((MemberLoginService.CustomUserDetails) principal).getMember();
        } else {
            throw new IllegalStateException("로그인된 사용자를 확인할 수 없습니다.");
        }
    }

    /**
     * 단일 상품 주문 생성
     */
    @PostMapping("/single")
    public ResponseEntity<OrderResponseDto> createSingleOrder(@RequestBody OrderRequestDto dto,
                                                              @AuthenticationPrincipal MemberLoginService.CustomUserDetails userDetails) {
        Member loginMember = userDetails.getMember();
        OrderResponseDto response = orderService.createSingleOrder(dto, loginMember);
        return ResponseEntity.ok(response);
    }

    /**
     * 장바구니 기반 주문 생성 → OrderResponseDto 반환으로 변경
     */
    @PostMapping("/from-cart")
    public ResponseEntity<OrderResponseDto> createOrderFromCart(@RequestBody OrderRequestDto dto,
                                                                @AuthenticationPrincipal MemberLoginService.CustomUserDetails userDetails) {
        Member loginMember = userDetails.getMember();
        OrderResponseDto response = orderService.createOrderFromCart(dto, loginMember);
        return ResponseEntity.ok(response);
    }

    /**
     * 로그인 회원의 전체 주문 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getAllOrders() {
        Member loginMember = extractLoginMember();
        List<OrderResponseDto> orders = orderService.getOrdersByMemberID(loginMember);
        return ResponseEntity.ok(orders);
    }

    /**
     * 결제 완료 처리
     */
    @PostMapping("/{orderId}/pay")
    public ResponseEntity<String> completePayment(@PathVariable("orderId") Long orderId) {
        orderService.completePayment(orderId);
        return ResponseEntity.ok("결제가 완료되었습니다.");
    }

    /**
     * 단건 주문 조회
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDetailResponseDto> getOrder(@PathVariable("orderId") Long orderId) {
        OrderDetailResponseDto dto = orderService.getOrderDetail(orderId);
        return ResponseEntity.ok(dto);
    }


    /**
     * 배송 정보 조회
     */
    @GetMapping("/{orderId}/delivery")
    public ResponseEntity<DeliveryStatusResponseDto> getDeliveryStatus(@PathVariable("orderId") Long orderId) {
        Delivery delivery = orderService.getDeliveryByOrderId(orderId);

        return ResponseEntity.ok(DeliveryStatusResponseDto.from(delivery));
    }

    /**
     * 기간별 총매출 조회
     */
    @GetMapping("/total-revenue")
    public ResponseEntity<Long> getTotalSales(@RequestParam String start, @RequestParam String end) {
        LocalDateTime startDateTime = LocalDate.parse(start).atStartOfDay();
        LocalDateTime endDateTime = LocalDate.parse(end).plusDays(1).atStartOfDay();
        Long total = orderService.getTotalSalesBetween(startDateTime, endDateTime);
        return ResponseEntity.ok(total);
    }

    /**
     * 기간별 주문 상태별 개수 조회
     */
    @GetMapping("/count-by-status")
    public ResponseEntity<Map<String, Long>> getOrderCountByStatus(@RequestParam String start, @RequestParam String end) {
        LocalDateTime startDateTime = LocalDate.parse(start).atStartOfDay();
        LocalDateTime endDateTime = LocalDate.parse(end).plusDays(1).atStartOfDay();
        Map<String, Long> result = orderService.countOrdersByStatusBetween(startDateTime, endDateTime);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<String> cancelOrder(@PathVariable("orderId") Long orderId) {
        Member loginMember = extractLoginMember();
        orderService.cancelOrder(orderId, loginMember.getId());
        return ResponseEntity.ok("주문이 취소되었습니다.");
    }
}