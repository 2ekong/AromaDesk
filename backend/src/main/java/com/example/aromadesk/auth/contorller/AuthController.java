package com.example.aromadesk.auth.contorller;

import com.example.aromadesk.auth.service.MemberLoginService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final MemberLoginService memberLoginService;

    public AuthController(MemberLoginService memberLoginService) {
        this.memberLoginService = memberLoginService;
    }

    @GetMapping("/login")
    public ResponseEntity<?> login() {
        // 프론트엔드 SPA가 로그인 페이지 렌더링을 담당한다는 의미로
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/social-info")
    public ResponseEntity<Map<String, String>> getSocialInfo(HttpServletRequest request) {
        String email = (String) request.getSession().getAttribute("email");
        String name = (String) request.getSession().getAttribute("name");
        Map<String, String> result = new HashMap<>();
        result.put("email", email);
        result.put("name", name);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/clear-social-session")
    public ResponseEntity<?> clearSocialSession(HttpServletRequest request) {
        request.getSession().removeAttribute("email");
        request.getSession().removeAttribute("name");
        return ResponseEntity.ok("소셜 세션 정보가 삭제되었습니다.");
    }
}
