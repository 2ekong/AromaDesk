package com.example.aromadesk.auth.service;

import com.example.aromadesk.member.entity.Member;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Getter
public class CustomOAuth2User implements OAuth2User {

    private final Member member;
    private final String email;
    private final String name;
    private final Map<String, Object> attributes;

    public CustomOAuth2User(Member member, Map<String, Object> attributes) {
        this.member = member;
        this.email = member.getEmail();
        this.name = member.getName();
        this.attributes = attributes;
    }

    public CustomOAuth2User(String email, String name, Map<String, Object> attributes) {
        this.member = null;
        this.email = email;
        this.name = name;
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // member가 있으면 권한 반환, 없으면 기본 USER 권한 등 임의 처리
        if (member != null) {
            return List.of(new SimpleGrantedAuthority(member.getRole()));
        }
        return List.of(new SimpleGrantedAuthority("ROLE_GUEST")); // 미가입 회원은 임시 권한 부여
    }

    @Override
    public String getName() {
        return name;
    }
}
