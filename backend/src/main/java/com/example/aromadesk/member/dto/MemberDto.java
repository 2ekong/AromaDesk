package com.example.aromadesk.member.dto;

import com.example.aromadesk.member.entity.Member;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MemberDto {
    private Long id;
    private String memberId;
    private String name;
    private String email;
    private String phone;
    private String password;
    private String address;
    private String zipCode;
    private String addressDetail;
    private String role;
    private LocalDateTime createdAt;

    // 엔티티 → DTO
    public static MemberDto fromEntity(Member member) {
        if (member == null) return null;
        return MemberDto.builder()
                .id(member.getId())
                .memberId(member.getMemberId())
                .name(member.getName())
                .email(member.getEmail())
                .phone(member.getPhone())
                .address(member.getAddress())
                .zipCode(member.getZipCode())
                .addressDetail(member.getAddressDetail())
                .role(member.getRole())
                .createdAt(member.getCreatedAt())
                // password는 응답에서 보통 제외, 필요시 주석 해제
                //.password(member.getPassword())
                .build();
    }

    // DTO → 엔티티
    public Member toEntity() {
        return Member.builder()
                .id(this.id)
                .memberId(this.memberId)
                .name(this.name)
                .email(this.email)
                .phone(this.phone)
                .address(this.address)
                .zipCode(this.zipCode)
                .addressDetail(this.addressDetail)
                .role(this.role)
                .createdAt(this.createdAt != null ? this.createdAt : LocalDateTime.now())
                .password(this.password)
                .build();
    }
}
