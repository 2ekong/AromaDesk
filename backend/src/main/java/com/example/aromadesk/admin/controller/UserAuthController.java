package com.example.aromadesk.admin.controller;

import com.example.aromadesk.member.dto.MemberDto;
import com.example.aromadesk.member.repository.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class UserAuthController {
    private final MemberRepository memberRepository;

    public UserAuthController(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        Object sessionUser = request.getSession().getAttribute("CusUser");
        if (sessionUser instanceof MemberDto userDto) {
            // 최신 값으로 재조회
            return memberRepository.findById(userDto.getId())
                    .map(MemberDto::fromEntity)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(404).body(null));
        }
        return ResponseEntity.status(401).body(null);
    }
}
