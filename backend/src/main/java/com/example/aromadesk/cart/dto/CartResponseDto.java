package com.example.aromadesk.cart.dto;

import com.example.aromadesk.cart.entity.Cart;
import com.example.aromadesk.product.entity.Product;
import lombok.Getter;

/**
 * @author : youngsic
 * @packageName : com.example.aromadesk.cart.dto
 * @fileName : CartResponseDto
 * @date : 25. 6. 21.
 * @see
 **/

@Getter
public class CartResponseDto {
    private Long cartItemId;
    private Long productId;
    private String name;
    private String imageUrl;
    private int price;
    private int quantity;

    /**
     *
     * @param cart DTO로 변환할 Cart 타입 엔티티
     */
    public CartResponseDto(Cart cart) {
        this.cartItemId = cart.getId();
        Product product = cart.getProduct();
        this.productId = product.getId();
        this.name = product.getName();
        this.imageUrl = product.getImageUrl();
        this.price = product.getPrice();
        this.quantity = cart.getQuantity();
    }
}
