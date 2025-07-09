package com.example.aromadesk.cart.controller;

import com.example.aromadesk.cart.dto.CartAddRequestDto;
import com.example.aromadesk.cart.dto.CartResponseDto;
import com.example.aromadesk.cart.dto.CartUpdateQuantityRequestDto;
import com.example.aromadesk.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author : youngsic
 * @packageName : com.example.aromadesk.cart.controller
 * @fileName : CartController
 * @date : 25. 6. 24.
 *
 **/
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final CartService cartService;

    /**
     * 특정 고객의 장바구니 목록 출력
     *
     * @param memberId 해당 장바구니를 소유한 고객의 id
     * @return 실패 or (성공 메세지 + JSON형태의 장바구니 목록)
     */
    @GetMapping("/cart/{memberId}")
    public ResponseEntity<List<CartResponseDto>> getCartItems(@PathVariable Long memberId) {
        List<CartResponseDto> cartItems = cartService.getCartItems(memberId);
        return ResponseEntity.ok(cartItems);
    }

    /**
     * 장바구니에 상품 추가(상품이 있다면 수량 변경)
     *
     * @param memberId 상품을 추가할 장바구니의 소유한 고객의 id
     * @param request 장바구니에 추가될 상품 { "productId": 5, "quantity": 2 , "price": 18000 }
     * @return 실패 or (성공 메세지 + 추가된 상품 정보)
     */
    @PostMapping("/members/{memberId}/cart")
    public ResponseEntity<CartResponseDto> addToCart(
            @PathVariable Long memberId,
            @RequestBody CartAddRequestDto request
    ) {
        CartResponseDto cart = cartService.addToCart(memberId, request.getProductId(), request.getQuantity());
        return ResponseEntity.ok(cart);
    }

    /**
     * 장바구니 상품 수량 변경
     *
     * @param memberId 수량이 변경될 상품을 가지고 있는 장바구니를 소유한 고객의 id
     * @param productId 수량을 변경할 상품의 id
     * @param request 요청된 수량 { "quantity": 7 }
     * @return 실패 or (성공 메세지 + 변경된 상품의 정보)
     */
    @PutMapping("/members/{memberId}/cart/{productId}")
    public ResponseEntity<CartResponseDto> updateQuantity(
            @PathVariable Long memberId,
            @PathVariable Long productId,
            @RequestBody CartUpdateQuantityRequestDto request
    ) {
        CartResponseDto updated = cartService.updateQuantity(memberId, productId, request.getQuantity());
        return ResponseEntity.ok(updated);
    }

    /**
     * 장바구니 상품 삭제
     *
     * @param memberId 상품을 삭제할 장바구니를 소유한 고객의 id
     * @param productId 삭제될 상품의 id
     * @return 성공 메세지
     */
    @DeleteMapping("/members/{memberId}/cart/{productId}")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable Long memberId,
            @PathVariable Long productId
    ) {
        cartService.removeFromCart(memberId, productId);
        return ResponseEntity.noContent().build();
    }
}
