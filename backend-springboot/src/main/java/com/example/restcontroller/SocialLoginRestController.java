// package com.example.restcontroller;

// import java.io.IOException;

// import jakarta.servlet.http.HttpServletResponse;
// import lombok.RequiredArgsConstructor;

// import org.springframework.security.core.annotation.AuthenticationPrincipal;
// import org.springframework.security.oauth2.core.user.OAuth2User; // ✅ 이거 추가
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// @RestController
// @RequestMapping("/api2/social")
// @RequiredArgsConstructor
// public class SocialLoginRestController {
  
//   @GetMapping("/oauth2/redirect")
// public void redirectToFrontend(HttpServletResponse response, @AuthenticationPrincipal OAuth2User user) throws IOException {
//     // 사용자 정보에서 필요한 값 추출 후 JWT 발급
//     String token = jwtService.generateToken(user);
    
//     // React 페이지로 리다이렉트
//     response.sendRedirect("http://localhost:8080/social-login-success?token=" + token);
// }
// }
