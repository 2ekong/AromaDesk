package com.example.aromadesk.auth.service;

import com.example.aromadesk.member.entity.Member;
import com.example.aromadesk.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId(); // "google", "naver", "kakao"

        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = null;
        String name = null;

        // provider별 사용자 정보 파싱
        if ("google".equals(registrationId)) {
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");
        } else if ("naver".equals(registrationId)) {
            Map<String, Object> response = (Map<String, Object>) attributes.get("response");
            email = (String) response.get("email");
            name = (String) response.get("name");
        } else if ("kakao".equals(registrationId)) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            email = (String) kakaoAccount.get("email");
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
            name = profile != null ? (String) profile.get("nickname") : null;
        }

        // 1. DB에서 email로 회원 조회
        Optional<Member> memberOpt = memberRepository.findByEmail(email);

        // 2. 없으면 신규 생성 (비밀번호는 null/랜덤/소셜플래그)
        Member member;
        if (memberOpt.isPresent()) {
            member = memberOpt.get();
        } else {
            return new CustomOAuth2User(email, name, attributes);

        }

        // 3. OAuth2User 리턴 (스프링 시큐리티는 OAuth2User로 인증상태 저장)
        // attributes: provider 원본 정보(필요시 사용)
        return new CustomOAuth2User(member, attributes);
    }
}
