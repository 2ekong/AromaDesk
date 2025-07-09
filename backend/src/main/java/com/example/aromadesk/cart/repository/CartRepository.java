package com.example.aromadesk.cart.repository;

import com.example.aromadesk.cart.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * @author : youngsic
 * @packageName : com.example.aromadesk.cart.repository
 * @fileName : CartRepository
 * @date : 25. 6. 24.
 * @see
 **/

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByMemberId(Long memberId);
    Optional<Cart> findByMemberIdAndProductId(Long memberId, Long productId);
    void deleteByMemberIdAndProductId(Long memberId, Long productId);
    List<Cart> findAllByIdInAndMemberId(List<Long> ids, Long memberId);
    
    // String memberId를 사용하는 메서드들 추가
    List<Cart> findByMemberMemberId(String memberId);
    Optional<Cart> findByMemberMemberIdAndProductId(String memberId, Long productId);
    void deleteByMemberMemberIdAndProductId(String memberId, Long productId);
}
