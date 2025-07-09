package com.example.aromadesk.cart.entity;

import com.example.aromadesk.member.entity.Member;
import com.example.aromadesk.product.entity.Product;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * @author : young
 * @packageName : com.example.aromadesk.cart.entity
 * @fileName : Cart
 * @date : 25. 6. 21.
 * @see
 **/
@Getter
@NoArgsConstructor
@Entity
@Table(name = "cart", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"member_id", "product_id"})
})
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 해당 장바구니의 주인(회원)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // 담긴 상품
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // 담은 수량
    private int quantity;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Cart(Member member, Product product, int quantity) {
        this.member = member;
        this.product = product;
        this.quantity = quantity;
    }

    public void updateQuantity(int quantity) {
        this.quantity = quantity;
    }
}
