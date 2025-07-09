package com.example.aromadesk.member.repository;


import com.example.aromadesk.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

//JWT 인증전 임의의 파일(order)관련
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByMemberIdAndPassword(String memberId, String password);

    Optional<Member> findByMemberId(String memberId);

    Optional<Member> findByEmail(String email);

    boolean existsByMemberId(String memberId);

    boolean existsByEmail(String email);
}
