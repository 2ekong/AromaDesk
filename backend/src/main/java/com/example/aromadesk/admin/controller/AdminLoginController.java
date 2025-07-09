package com.example.aromadesk.admin.controller;

import com.example.aromadesk.admin.dto.AdminDto;
import com.example.aromadesk.admin.entity.Admin;
import com.example.aromadesk.admin.repository.AdminRepository;
import com.example.aromadesk.auth.service.AdminLoginService;
import com.example.aromadesk.member.dto.MemberDto;
import com.example.aromadesk.member.entity.Member;
import com.example.aromadesk.member.repository.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin")   // RESTful한 url 사용 권장
@RequiredArgsConstructor          // final 필드 생성자 자동 생성 (lombok)
public class AdminLoginController {
    @Autowired
    private final AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AdminLoginService adminLoginService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminDto dto, HttpServletRequest request) {
        Optional<Admin> adminOpt = adminRepository.findByUsername(dto.getUsername());
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(401).body("존재하지 않는 관리자입니다.");
        }
        Admin admin = adminOpt.get();

        if (!passwordEncoder.matches(dto.getPassword(), admin.getPassword())) {
            return ResponseEntity.status(401).body("비밀번호가 일치하지 않습니다.");
        }

        // 0. 기존 세션 무효화
        HttpSession oldSession = request.getSession(false);
        if(oldSession != null) {
            oldSession.invalidate();
        }

        // 1. 새로운 세션 생성
        HttpSession session = request.getSession(true);

        // 2. UserDetails 만들기 (AdminLoginService에서 loadUserByUsername 활용)
        UserDetails userDetails = adminLoginService.loadUserByUsername(dto.getUsername());

        // 3. 인증 토큰 생성 및 SecurityContext에 저장
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authToken);
        SecurityContextHolder.setContext(context);

        // 4. 세션에 SPRING_SECURITY_CONTEXT_KEY로 저장
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

        // 5. 관리자 정보 세션에도 저장(선택)
        session.setAttribute("Admin", AdminDto.fromEntity(admin));

        // 6. 응답 구성
        Map<String, Object> response = new HashMap<>();
        response.put("admin", AdminDto.fromEntity(admin));
        response.put("AdminUser", session.getId());
        response.put("message", "관리자 로그인 성공");

        return ResponseEntity.ok(response);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdmin(@PathVariable Long id) {
        Optional<Admin> admin = adminRepository.findById(id);
        return admin.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}