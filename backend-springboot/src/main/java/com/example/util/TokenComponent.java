// ✅ TokenComponent.java (소문자로 통일)
package com.example.util;

import java.security.SignatureException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.security.Keys;

import static io.jsonwebtoken.Jwts.builder;
import static io.jsonwebtoken.Jwts.parser;
import io.jsonwebtoken.Jwts.SIG;

@Component
public class TokenComponent {

    private final String strkKeys = "asdsad1287s123123abcdbasd";
    private final byte[] keyBytes = Base64.getEncoder().encode(strkKeys.getBytes());
    private final SecretKey key = Keys.hmacShaKeyFor(keyBytes);

    public String create(Long no, String userid, String nickname, int buyer, int seller, int admin) {
        try {
            if (nickname == null) throw new IllegalArgumentException("nickname is null");
            LocalDateTime expiredAt = LocalDateTime.now().plusHours(10);
            Date expiredDate = Date.from(expiredAt.atZone(ZoneId.systemDefault()).toInstant());

            return builder()
                    .signWith(key, SIG.HS256)
                    .claim("mno", no)
                    .claim("userid", userid)
                    .claim("nickname", nickname)
                    .claim("buyer", buyer)
                    .claim("seller", seller)
                    .claim("admin", admin)
                    .expiration(expiredDate)
                    .compact();

        } catch (Exception e) {
            System.out.println("❌ Token creation error: " + e.getMessage());
            return null;
        }
    }

    public Map<String, Object> validate(String token) {
        Map<String, Object> userInfo = new HashMap<>();
        try {
            Jws<Claims> result = parser().verifyWith(key).build().parseSignedClaims(token);
            Claims claims = result.getPayload();

            userInfo.put("mno", claims.get("mno"));
            userInfo.put("userid", claims.get("userid"));
            userInfo.put("nickname", claims.get("nickname"));
            userInfo.put("buyer", claims.get("buyer"));
            
            userInfo.put("seller", claims.get("seller"));
            userInfo.put("admin", claims.get("admin"));

            return userInfo;
        } catch (Exception e) {
            if (e instanceof SignatureException) {
                throw new RuntimeException("Invalid token");
            } else if (e instanceof ExpiredJwtException) {
                throw new RuntimeException("Token expired");
            } else {
                throw new RuntimeException("Token error: " + e.getMessage());
            }
        }
    }

    public String getTokenForUser(String id) {
        throw new UnsupportedOperationException("Unimplemented method 'getTokenForUser'");
    }
} 
