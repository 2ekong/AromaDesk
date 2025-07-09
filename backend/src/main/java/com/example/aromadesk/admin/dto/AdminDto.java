package com.example.aromadesk.admin.dto;

import com.example.aromadesk.admin.entity.Admin;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminDto {
    private Long id;
    private String username;
    private String password;
    private String name;
    private String role;
    private LocalDateTime createdAt;

    // 엔티티 → DTO
    public static AdminDto fromEntity(Admin admin) {
        if (admin == null) return null;
        return AdminDto.builder()
                .id(admin.getId())
                .username(admin.getUsername())
                .name(admin.getName())
                .role(admin.getRole())
                .createdAt(admin.getCreatedAt())
                //.password(admin.getPassword()) // 보안상 주석 처리
                .build();
    }

    // DTO → 엔티티
    public Admin toEntity() {
        return Admin.builder()
                .id(this.id)
                .username(this.username)
                .password(this.password)
                .name(this.name)
                .role(this.role)
                .createdAt(this.createdAt != null ? this.createdAt : LocalDateTime.now())
                .build();
    }
}