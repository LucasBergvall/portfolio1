// 📁 com.example.config.CorsConfig.java
package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true); // ✅ 인증 정보 포함 (ex: Authorization 헤더 허용)
        config.addAllowedOrigin("http://localhost:3000"); // ✅ 프론트 주소 (React)
        config.addAllowedHeader("*"); // ✅ 모든 헤더 허용
        config.addAllowedMethod("*"); // ✅ GET, POST, PUT, DELETE 등 모두 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
