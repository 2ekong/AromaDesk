package com.example.aromadesk.cart.service;

import com.example.aromadesk.cart.dto.CartResponseDto;
import com.example.aromadesk.cart.entity.Cart;
import com.example.aromadesk.cart.repository.CartRepository;
import com.example.aromadesk.member.entity.Member;
import com.example.aromadesk.member.repository.MemberRepository;
import com.example.aromadesk.product.entity.Product;
import com.example.aromadesk.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @author : youngsic
 * @packageName : com.example.aromadesk.cart.service
 * @fileName : CartService
 * @date : 25. 6. 24.
 *
 **/

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;

    /**
     * 특정 고객의 장바구니 전체 출력
     *
     * @param memberId 해당 장바구니를 소유한 고객 id
     * @return 해당 고객의 장바구니
     */
    public List<CartResponseDto> getCartItems(Long memberId) {
        return cartRepository.findByMemberId(memberId).stream().map(CartResponseDto::new).collect(Collectors.toList());
    }

    /**
     * 장바구니에 상품 추가 (상품이 있으면 수량 추가)
     *
     * @param memberId 특정 고객의 id
     * @param productId 추가할 상품의 id
     * @param quantity 장바구니에 적용될 상품의 수량
     * @return 상품 추가된 DTO, 또는 에러메세지 반환
     */
    public CartResponseDto addToCart(Long memberId, Long productId, int quantity) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 고객을 찾을 수 없습니다."));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 상품을 찾을 수 없습니다."));

        if (quantity <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수량은 1개 이상이어야 합니다.");
        }

        Optional<Cart> optionalCart = cartRepository.findByMemberIdAndProductId(memberId, productId);
        Cart cart;
        if (optionalCart.isPresent()) {
            cart = optionalCart.get();
            if (quantity > product.getStock()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "재고를 초과했습니다. 최대 담을 수 있는 수량은 " + product.getStock() + "개입니다.");
            }
            cart.updateQuantity(quantity);
        } else {
            if (quantity > product.getStock()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "재고가 부족합니다. 남은 재고: " + product.getStock() + "개");
            }
            cart = new Cart(member, product, quantity);
        }

        cartRepository.save(cart);
        return new CartResponseDto(cart);
    }


    /**
     * 장바구니 내부 특정 상품의 수량 변경
     * 
     * @param memberId 특정 고객의 장바구니 id
     * @param productId 수량을 변경할 상품의 id
     * @param quantity 장바구니에 적용될 수량
     * @return 수량이 변경된 상품 DTO, 또는 에러메세지 반환
     */
    public CartResponseDto updateQuantity(Long memberId, Long productId, int quantity) {
        if(quantity <= 0 ) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수량은 1개 이상이어야 합니다.");
        }

        Cart cart = cartRepository.findByMemberIdAndProductId(memberId, productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "장바구니에 해당 상품이 없습니다."));

        // 상품 재고 체크 추가
        Product product = cart.getProduct();
        if (quantity > product.getStock()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "재고가 부족합니다. 남은 재고: " + product.getStock() + "개");
        }

        cart.updateQuantity(quantity);
        cartRepository.save(cart);
        return new CartResponseDto(cart);
    }

    /**
     * 장바구니에서 특정 상품 제거
     *
     * @param memberId 장바구니 조회용 고객 id
     * @param productId 삭제할 상품의 id
     */
    public void removeFromCart(Long memberId, Long productId) {
        Cart cart = cartRepository.findByMemberIdAndProductId(memberId, productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "장바구니에 해당 상품이 없습니다."));

        cartRepository.delete(cart);
    }
}
