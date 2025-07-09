package com.example.aromadesk.member.controller;

import com.example.aromadesk.auth.service.MemberLoginService;
import com.example.aromadesk.member.dto.LoginRequest;
import com.example.aromadesk.member.dto.MemberDto;
import com.example.aromadesk.member.dto.UpdateAddressDto;
import com.example.aromadesk.member.entity.Member;
import com.example.aromadesk.member.repository.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/signin")
@RequiredArgsConstructor
public class MemberSigninController {

    private final MemberRepository memberRepository;

    private final PasswordEncoder passwordEncoder;
    private final MemberLoginService memberLoginService;

    // ID 중복 조회 (GET /api/signin/check-id)
    @GetMapping("/check-id")
    public ResponseEntity<Map<String, Boolean>> checkMemberId(@RequestParam String memberId) {
        boolean isAvailable = !memberRepository.existsByMemberId(memberId);
        return ResponseEntity.ok(Collections.singletonMap("available", isAvailable));
    }

    // email 중복 조회 (GET /api/signin/check-email)
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmail(@RequestParam String email) {
        boolean isAvailable = !memberRepository.existsByEmail(email);
        return ResponseEntity.ok(Collections.singletonMap("available", isAvailable));
    }

    // 회원가입 (POST /api/signin)
    @PostMapping
    public ResponseEntity<MemberDto> createMember(@RequestBody MemberDto dto, HttpSession session) {
        Member member = dto.toEntity();
        member.setPassword(passwordEncoder.encode(dto.getPassword())); // 비밀번호 암호화
        Member newMember = memberRepository.save(member);
        session.removeAttribute("email");
        session.removeAttribute("name");
        return ResponseEntity.ok(MemberDto.fromEntity(newMember));
    }

}
