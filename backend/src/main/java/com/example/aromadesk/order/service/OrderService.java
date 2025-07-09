package com.example.aromadesk.order.service;

import com.example.aromadesk.cart.dto.CartRequestDto;
import com.example.aromadesk.cart.entity.Cart;
import com.example.aromadesk.cart.repository.CartRepository;
import com.example.aromadesk.delivery.entity.Delivery;
import com.example.aromadesk.delivery.entity.DeliveryStatus;
import com.example.aromadesk.delivery.repostiory.DeliveryRepository;
import com.example.aromadesk.member.entity.Member;
import com.example.aromadesk.member.repository.MemberRepository;
import com.example.aromadesk.order.dto.OrderDetailResponseDto;
import com.example.aromadesk.order.dto.OrderProductNameDto;
import com.example.aromadesk.order.dto.OrderRequestDto;
import com.example.aromadesk.order.dto.OrderResponseDto;
import com.example.aromadesk.order.entity.Order;
import com.example.aromadesk.order.entity.OrderItem;
import com.example.aromadesk.order.entity.OrderStatus;
import com.example.aromadesk.order.repository.OrderRepository;
import com.example.aromadesk.product.entity.Product;
import com.example.aromadesk.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/*************************************************************
 /* SYSTEM NAME      : Order
 /* PROGRAM NAME     : OrderService.class
 /* DESCRIPTION      : 주문 관련 비즈니스 로직 처리
 /* MODIFIVATION LOG :
 /* DATA         AUTHOR          DESC.
 /*--------     ---------    ----------------------
 /*2025.06.24   SUSU        INITIAL RELEASE
 /*2025.06.25   SUSU        단일/장바구니 주문 로직 분리 및 추가 구현
 /*2025.06.26   susu        member 객체로 변경
 /*2025.06.26   KANG        기간별 총메출 메소드 추가
 /*2025.06.30   SUSU        장바구니 주문시 OrderResponseDto 반환 추가
 /*2025.07.03   SUSU        배송지 직접 입력 방식으로 수정 (Delivery 생성)
 /*2025.07.05   SUSU        주문 상세 조회 추가
 /*2025.07.07   SUSU        주문 취소 기능 추가
 /*************************************************************/

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final MemberRepository memberRepository;
    private final DeliveryRepository deliveryRepository;
    private final CartRepository cartRepository;

    /**
     * 단일 상품 주문 처리
     */
    @Transactional
    public OrderResponseDto createSingleOrder(OrderRequestDto dto, Member member) {
        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new IllegalArgumentException("주문 항목이 비어 있습니다.");
        }

        List<OrderItem> orderItems = dto.getItems().stream().map(itemDto -> {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("상품이 존재하지 않습니다. id=" + itemDto.getProductId()));

            if (product.getStock() < itemDto.getQuantity()) {
                throw new IllegalArgumentException("재고가 부족합니다: " + product.getName());
            }

            product.setStock(product.getStock() - itemDto.getQuantity());

            return OrderItem.builder()
                    .product(product)
                    .quantity(itemDto.getQuantity())
                    .price(product.getPrice())
                    .build();
        }).collect(Collectors.toList());

        int totalPrice = orderItems.stream()
                .mapToInt(item -> item.getPrice() * item.getQuantity())
                .sum();

        Order order = Order.builder()
                .member(member)
                .orderStatus(dto.getPaymentMethod().name().equals("MOCK") ? OrderStatus.PAID : OrderStatus.ORDERED)
                .paymentMethod(dto.getPaymentMethod())
                .totalPrice(totalPrice)
                .build();

        orderItems.forEach(item -> item.setOrder(order));
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // 배송 정보 생성 후 저장
        Delivery delivery = Delivery.builder()
                .address(dto.getAddress())
                .status(com.example.aromadesk.delivery.entity.DeliveryStatus.PREPARING)
                .order(savedOrder)
                .build();

        deliveryRepository.save(delivery);

        // 배송 정보 연결 후 주문 업데이트
        savedOrder.setDelivery(delivery);

        return OrderResponseDto.from(savedOrder);
    }

    /**
     * 장바구니 기반 주문 처리
     */
    @Transactional
    public OrderResponseDto createOrderFromCart(OrderRequestDto dto, Member member) {
        List<Cart> cartItems = cartRepository.findAllByIdInAndMemberId(dto.getCartItemIds(), member.getId());

        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("선택된 장바구니 항목이 없습니다. id = " + dto.getCartItemIds());
        }

        List<OrderItem> orderItems = new ArrayList<>();
        int totalPrice = 0;

        for (Cart cart : cartItems) {
            Product product = cart.getProduct();
            int quantity = cart.getQuantity();

            if (product.getStock() < quantity) {
                throw new IllegalArgumentException("재고 부족: " + product.getName());
            }

            product.setStock(product.getStock() - quantity);

            OrderItem item = OrderItem.builder()
                    .product(product)
                    .quantity(quantity)
                    .price(product.getPrice())
                    .build();

            orderItems.add(item);
            totalPrice += product.getPrice() * quantity;
        }

        Order order = Order.builder()
                .member(member)
                .orderStatus(dto.getPaymentMethod().name().equals("MOCK") ? OrderStatus.PAID : OrderStatus.ORDERED)
                .paymentMethod(dto.getPaymentMethod())
                .totalPrice(totalPrice)
                .build();

        orderItems.forEach(item -> item.setOrder(order));
        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // 배송 정보 생성 후 저장
        Delivery delivery = Delivery.builder()
                .address(dto.getAddress())
                .status(com.example.aromadesk.delivery.entity.DeliveryStatus.PREPARING)
                .order(savedOrder)
                .build();

        deliveryRepository.save(delivery);

        // 배송 정보 연결 후 주문 업데이트
        savedOrder.setDelivery(delivery);
        cartRepository.deleteAll(cartItems);

        return OrderResponseDto.from(savedOrder);
    }


    /**
     * 회원의 전체 주문 목록 조회
     *
     * @param  member 조회할 회원
     * @return 회원의 주문 목록 DTO 리스트
     */

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrdersByMemberID(Member member) {
        List<Order> orders = orderRepository.findByMemberId(member.getId());
        return orders.stream()
                .map(OrderResponseDto::from)
                .collect(Collectors.toList());
    }

    /**
     * 주문 결제 완료 처리
     * @param orderId 결제할 주문 ID
     * @throws IllegalArgumentException 주문이 존재하지 않거나 이미 결제된 경우 예외 발생
     */

    @Transactional
    public void completePayment(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문이 존재하지 않습니다. orderId=" + orderId));

        if (order.getOrderStatus() != OrderStatus.ORDERED) {
            throw new IllegalArgumentException("이미 결제된 주문입니다.");
        }

        order.setOrderStatus(OrderStatus.PAID);
    }

    /**
     * 특정 기간 동안의 총 매출 조회
     *
     * @param start 시작일
     * @param end 종료일
     * @return 기간 내 총 매출액
     */

    @Transactional(readOnly = true)
    public Long getTotalSalesBetween(LocalDateTime start, LocalDateTime end) {
        Long total = orderRepository.getTotalSalesBetween(start, end);
        return total != null ? total : 0L;
    }

    /**
     * 특정 기간 동안의 주문 상태별 건수 조회
     *
     * @param start 시작일
     * @param end 종료일
     * @return 상태별 주문 건수 맵
     */

    @Transactional(readOnly = true)
    public Map<String, Long> countOrdersByStatusBetween(LocalDateTime start, LocalDateTime end) {
        List<Object[]> result = orderRepository.countOrdersByStatusBetween(start, end);
        Map<String, Long> countMap = new HashMap<>();
        for (Object[] row : result) {
            String status = row[0].toString();
            Long count = (Long) row[1];
            countMap.put(status, count);
        }
        return countMap;
    }

    /**
     * 주문 ID로 배송 정보 조회
     *
     * @param orderId 주문 ID
     * @return 배송 정보 엔티티
     * @throws IllegalArgumentException 주문이 존재하지 않는 경우 예외 발생
     * @throws IllegalStateException 배송 정보가 없는 경우 예외 발생
     */
    @Transactional(readOnly = true)
    public Delivery getDeliveryByOrderId(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문이 존재하지 않습니다. orderId=" + orderId));

        Delivery delivery = order.getDelivery();
        if (delivery == null) {
            throw new IllegalStateException("배송 정보가 없습니다. orderId=" + orderId);
        }

        return delivery;
    }

    /**
     * 주문 ID로 배송 상태만 조회
     *
     * @param orderId 주문 ID
     * @return 배송 상태 문자열 (배송 정보 없음 시 "배송 정보 없음")
     * @throws IllegalArgumentException 주문이 존재하지 않는 경우 예외 발생
     */
    @Transactional(readOnly = true)
    public String getDeliveryStatus(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문이 존재하지 않습니다. orderId=" + orderId));

        Delivery delivery = order.getDelivery();
        if (delivery == null) {
            return "배송 정보 없음";
        }

        return delivery.getStatus().name();  // DeliveryStatus Enum 값을 문자열로 반환
    }

    /**
     * 주문 상세 조회(배송 정보 포함)
     * @param orderId 주문 ID
     * @return 주문 상세 정보 DTO
     */

    @Transactional(readOnly = true)
    public OrderDetailResponseDto getOrderDetail(Long orderId) {
        Order order = orderRepository.findWithDeliveryById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("해당 주문이 존재하지 않습니다. orderId=" + orderId));

        return OrderDetailResponseDto.from(order);
    }


    /**
     * 관리자용 전체 주문 목록 조회
     * - 모든 주문 상태 및 배송 상태 포함
     */
    @Transactional(readOnly = true)
    public Page<OrderResponseDto> getAllOrdersForAdmin(Pageable pageable) {
        // 주문, 배송, 회원 정보를 fetch join으로 가져옴
        Page<Order> orderPage = orderRepository.findAllWithDeliveryAndMember(pageable);

        // 주문 ID 리스트 추출
        List<Long> orderIds = orderPage.getContent().stream()
                .map(Order::getId)
                .collect(Collectors.toList());

        // 주문 ID별 상품명 조회
        List<OrderProductNameDto> productNameDtos = orderRepository.findOrderProductNamesByOrderIds(orderIds);

        // orderId 기준으로 상품명 그룹핑
        Map<Long, List<String>> productNameMap = productNameDtos.stream()
                .collect(Collectors.groupingBy(
                        OrderProductNameDto::getOrderId,
                        Collectors.mapping(OrderProductNameDto::getProductName, Collectors.toList())
                ));

        // Order -> OrderResponseDto 변환 (상품명 포함)
        return orderPage.map(order ->
                OrderResponseDto.from(order, productNameMap.getOrDefault(order.getId(), Collections.emptyList()))
        );
    }

    @Transactional
    public void updateOrderStatus(Long orderId, String orderStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문이 존재하지 않습니다. orderId=" + orderId));

        order.setOrderStatus(OrderStatus.valueOf(orderStatus));
    }

    @Transactional
    public void cancelOrder(Long orderId, Long memberId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다"));

        //본인 주문인지 확인
        if(!order.getMember().getId().equals(memberId)) {
            throw new RuntimeException("본인의 주문만 취소 할 수 있습니다.");
        }

        //이미 취소된 주문인지 확인
        if(order.getOrderStatus() == OrderStatus.CANCELLED) {
            throw new RuntimeException("이미 취소된 주문입니다.");
        }

        //배송 상태가 배송 완료면 취소 불가
        if(order.getDelivery() != null && order.getDelivery().getStatus() == DeliveryStatus.DELIVERED) {
            throw new RuntimeException("배송이 완료된 주문은 취소할 수 없습니다.");
        }

        //주문 상태 변경
        order.setOrderStatus(OrderStatus.CANCELLED);

    }

}
