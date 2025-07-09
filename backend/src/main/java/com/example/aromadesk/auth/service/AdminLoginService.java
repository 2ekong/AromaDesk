package com.example.aromadesk.auth.service;

import com.example.aromadesk.admin.entity.Admin;
import com.example.aromadesk.admin.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AdminLoginService implements UserDetailsService {
    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("관리자 없음: " + username));
        return User.builder()
                .username(admin.getUsername())
                .password(admin.getPassword()) // 이미 암호화된 값
                .roles("ADMIN")
                .build();
    }
}