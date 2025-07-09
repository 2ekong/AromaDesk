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

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/members")   // RESTful한 url 사용 권장
@RequiredArgsConstructor          // final 필드 생성자 자동 생성 (lombok)
public class MemberController {

    private final MemberRepository memberRepository;

    private final PasswordEncoder passwordEncoder;
    private final MemberLoginService memberLoginService;

    // 회원 전체 목록 조회 (GET /api/members)            삭제 후 테스트 필요
    @GetMapping
    public ResponseEntity<?> getAllMembers() {
        List<MemberDto> dtos = memberRepository.findAll()
                .stream()
                .map(MemberDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // 회원 단일 조회 (GET /api/members/{id})
    @GetMapping("/{id}")
    public ResponseEntity<MemberDto> getMember(@PathVariable Long id) {
        Optional<Member> member = memberRepository.findById(id);
        return member.map(m -> ResponseEntity.ok(MemberDto.fromEntity(m)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 회원가입 (POST /api/members)     삭제 후 테스트 필요
    @PostMapping
    public ResponseEntity<MemberDto> createMember(@RequestBody MemberDto dto, HttpSession session) {
        Member member = dto.toEntity();
        member.setPassword(passwordEncoder.encode(dto.getPassword())); // 비밀번호 암호화
        Member newMember = memberRepository.save(member);
        session.removeAttribute("email");
        session.removeAttribute("name");
        return ResponseEntity.ok(MemberDto.fromEntity(newMember));
    }

    // 회원 정보 수정 (PUT /api/members/{id})
    @PostMapping("/{id}")
    public ResponseEntity<MemberDto> updateMember(@PathVariable Long id, @RequestBody MemberDto updateRequest) {
        return memberRepository.findById(id)
                .map(member -> {
                    member.setEmail(updateRequest.getEmail());
                    if (updateRequest.getPassword() != null && !updateRequest.getPassword().isEmpty()) {
                        member.setPassword(passwordEncoder.encode(updateRequest.getPassword())); // 비밀번호 암호화
                    }
                    member.setName(updateRequest.getName());
                    member.setPhone(updateRequest.getPhone());
                    member.setAddress(updateRequest.getAddress());
                    member.setRole(updateRequest.getRole());
                    // createdAt은 보통 변경하지 않음
                    Member updated = memberRepository.save(member);
                    return ResponseEntity.ok(MemberDto.fromEntity(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/changePassword")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> passwordMap) {
        String currentPassword = passwordMap.get("currentPassword");
        String newPassword = passwordMap.get("newPassword");
        String confirmPassword = passwordMap.get("confirmPassword");

        // 새 비밀번호와 확인값 일치 여부 체크
        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body("새 비밀번호와 확인 값이 일치하지 않습니다.");
        }

        return memberRepository.findById(id)
                .map(member -> {
                    // 현재 비밀번호 검증
                    if (!passwordEncoder.matches(currentPassword, member.getPassword())) {
                        return ResponseEntity.badRequest().body("현재 비밀번호가 일치하지 않습니다.");
                    }
                    // 비밀번호 변경
                    member.setPassword(passwordEncoder.encode(newPassword));
                    memberRepository.save(member);
                    return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
                })
                .orElse(ResponseEntity.notFound().build());
    }


    @PatchMapping("/{id}/address")
    public ResponseEntity<?> updateAddress(@PathVariable Long id, @RequestBody UpdateAddressDto request) {
        return memberRepository.findById(id)
                .map(member -> {
                    member.setAddress(request.getAddress());
                    member.setZipCode(request.getZipCode());
                    member.setAddressDetail(request.getAddressDetail());
                    Member updated = memberRepository.save(member);
                    return ResponseEntity.ok(MemberDto.fromEntity(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 회원 삭제 (DELETE /api/members/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        if (memberRepository.existsById(id)) {
            memberRepository.deleteById(id);
            return ResponseEntity.ok().build(); // 200 OK
        } else {
            return ResponseEntity.notFound().build();
        }
    }

/*    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberDto dto, HttpSession session) {
        // 1. memberId로 DB에서 회원 찾기
        Optional<Member> memberOpt = memberRepository.findByMemberId(dto.getMemberId());
        if (memberOpt.isEmpty()) {
            return ResponseEntity.status(401).body("존재하지 않는 회원입니다.");
        }
        Member member = memberOpt.get();

        // 2. 비밀번호 일치하는지 확인(암호화 비교)
        if (!passwordEncoder.matches(dto.getPassword(), member.getPassword())) {
            return ResponseEntity.status(401).body("비밀번호가 일치하지 않습니다.");
        }

        // 3. 로그인 성공 → JWT 토큰 발급 or 세션 처리
        MemberDto loginUserDto = MemberDto.fromEntity(member);
        session.setAttribute("CusUser", loginUserDto);
        return ResponseEntity.ok(loginUserDto);
    }*/

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request) {
        // 0. 기존 세션 무효화
        HttpSession oldSession = request.getSession(false);
        if (oldSession != null) {
            oldSession.invalidate();
        }

        // 1. 새로운 세션 생성
        HttpSession session = request.getSession(true);

        // 2. UserDetails 생성
        UserDetails userDetails = memberLoginService.loadUserByUsername(loginRequest.getMemberId());

        // 3. 비밀번호 검증
        if (!passwordEncoder.matches(loginRequest.getPassword(), userDetails.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 틀렸습니다");
        }

        // 4. 인증 토큰 생성 및 SecurityContext에 저장
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authToken);
        SecurityContextHolder.setContext(context);

        // 5. 세션에 SPRING_SECURITY_CONTEXT 저장
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

        // 6. 사용자 정보 세션에 저장
        Member member = ((MemberLoginService.CustomUserDetails) userDetails).getMember();
        MemberDto memberDto = MemberDto.fromEntity(member);
        session.setAttribute("CusUser", memberDto);

        // 7. 로그인 성공 시 사용자 식별에 필요한 최소한의 정보만 반환
        Map<String, Object> response = new HashMap<>();
        response.put("memberId", memberDto.getMemberId());
        response.put("name", memberDto.getName());
        response.put("email", memberDto.getEmail());
        response.put("role", memberDto.getRole());
        
        return ResponseEntity.ok(response);
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.removeAttribute("CusUser");
        return ResponseEntity.ok("로그아웃되었습니다.");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(HttpSession session) {
        Object user = session.getAttribute("CusUser");
        if (user == null) {
            return ResponseEntity.status(401).body("로그인 필요");
        }
        return ResponseEntity.ok(user);
    }
}
