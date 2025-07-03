package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

// 환경설정파일 => 서버가 구동될때 실행됨. 오류발생 서버중지
@Configuration
// 시큐리티 웹 활성화
@EnableWebSecurity
public class SecurityConfig {
    
    // 자동객체 생성
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // csrf보안을 /api2로 시작하는 주소는 해제
        http.csrf(csrf -> csrf.ignoringRequestMatchers("/api2/**"));
        return http.build();
    }
}