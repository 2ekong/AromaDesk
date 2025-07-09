package com.example.aromadesk.config;

import com.example.aromadesk.auth.service.AdminLoginService;
import com.example.aromadesk.auth.service.CustomOAuth2SuccessHandler;
import com.example.aromadesk.auth.service.CustomOAuth2UserService;
import com.example.aromadesk.auth.service.MemberLoginService;
import com.example.aromadesk.member.repository.MemberRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	private final MemberLoginService memberLoginService;
	private final AdminLoginService adminLoginService;
  
  
	public SecurityConfig(MemberLoginService memberLoginService, AdminLoginService adminLoginService) {
		this.memberLoginService = memberLoginService;
		this.adminLoginService = adminLoginService;
	}
  // Security 필터 체인 설정
	@Bean
	@Order(2)
	public SecurityFilterChain userSecurityFilterChain(HttpSecurity http, MemberRepository memberRepository,
	CustomOAuth2SuccessHandler customOAuth2SuccessHandler, CorsConfigurationSource corsConfigurationSource) throws Exception {
		http
				.cors(cors -> cors.configurationSource(corsConfigurationSource))
				.csrf(csrf -> csrf.disable())
				.userDetailsService(memberLoginService)
				.securityMatcher("/**")
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(
								"/", "/auth/login",
								"/api/members/login", "/api/members/logout",
								"/css/**", "/js/**", "/images/**",
								"/api/health", "/api/products/**", "/error",
								"/members/**","/api/orders/**",
								"/oauth2/**", "/login/oauth2/**", "/oauth2/authorization/**",
								"/api/signin/**"
						).permitAll()
						.anyRequest().authenticated()
				)
				// 인증 실패 시 JSON 응답 반환
				.exceptionHandling(exceptionHandling -> exceptionHandling
					.authenticationEntryPoint((request, response, authException) -> {
						response.setStatus(401);
						response.setContentType("application/json;charset=UTF-8");
						response.getWriter().write("{\"error\":\"로그인 필요\"}");
					})
				)
				// 소셜 로그인 기능 활성화
				.oauth2Login(oauth2 -> oauth2
						.loginPage("/auth/login") // 소셜, 자체 로그인 모두 동일한 페이지 사용
						.userInfoEndpoint(userInfo -> userInfo
								.userService(customOAuth2UserService(memberRepository, passwordEncoder())) // 커스텀 서비스 구현 필요!
						)
						.successHandler(customOAuth2SuccessHandler)
				);

		return http.build();
	}
  // Security 필터 체인 설정
	@Bean
	@Order(1)
	public SecurityFilterChain adminSecurityFilterChain(HttpSecurity http,  CorsConfigurationSource corsConfigurationSource) throws Exception {
		http
				.cors(cors -> cors.configurationSource(corsConfigurationSource))
				.csrf(csrf -> csrf.disable())
				.userDetailsService(adminLoginService)
				.securityMatcher("/admin/**", "/api/admin/**")
				.authorizeHttpRequests(auth -> auth
						.requestMatchers("/admin/login", "/admin/login-process").permitAll()
						.anyRequest().hasRole("ADMIN")
				);
		return http.build();
	}
  // 비밀번호 암호화 방식
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public CustomOAuth2UserService customOAuth2UserService(MemberRepository memberRepository, PasswordEncoder passwordEncoder) {
		return new CustomOAuth2UserService(memberRepository, passwordEncoder);
	}
}
