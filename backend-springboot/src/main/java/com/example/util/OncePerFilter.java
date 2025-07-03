package com.example.util;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OncePerFilter extends OncePerRequestFilter {

    private final TokenComponent tComponent;

    // ✅ 인증 필터를 적용하지 않을 경로 리스트
    private static final List<String> WHITELIST = Arrays.asList(
        "/api2/member/login",
        "/api2/member/loginbuyer",
        "/api2/member/join",
        "/api2/member/find-id",
        "/api2/member/reset-password",
        
        "/api2/address/insert",

        "/api2/itemimage/image",
        "/api2/itemimage/imagelist",
        
        "/api2/itemdetail/getitem",

        "/api2/img/insert",
        "/api2/img/image",
        
        // 게시판
        "/api2/board/insert",
        "/api2/board/selectlist",
        "/api2/board/select",
        "/api2/board/delete",
        
        // 공지사항
        "/api2/notice/selectlist",
        "/api2/notice/select",


        "/api2/actionboard/delete",

        "/api2/genre/selectitemlist",
        
        "/api2/item/genrelist",
        "/api2/item/genrelist/buyer",

        "/api2/item/selectitemlist",
        "/api2/item/select",
        "/api2/item/selectlist",  // ✅ 토큰 없이 접근 허용
        
        "/api2/breply/list",

        // 로그인
        "/api2/member/naverlogin",
        "/api2/member/kakaologin",
        "/api2/member/googlelogin",

        // 베스트셀러
        "/api2/bestsellerbook/selectlist",
        "/api2/bestsellerbook/selectone",

        // ✅ 출판사 추천 추가
        "/api2/recommend/group/",
        "/api2/recommend/selectone",
        "/api2/mdrecommend/group/",
        "/api2/mdrecommend/selectone",

        // 검색 기능
        "/api2/item/search"
    
    );

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        // return WHITELIST.contains(path);
        return WHITELIST.stream().anyMatch(path::startsWith);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            System.out.println("========= 🔒 필터 작동 중 =========");
            System.out.println("요청 URI: " + request.getRequestURI());

            String token = request.getHeader("Authorization");

            // ✅ Authorization 헤더에서 Bearer 제거
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // ✅ 토큰 유효성 검사 및 payload 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            String userid = userInfo.get("userid").toString();

            // ✅ 인증된 사용자 정보 request에 저장
            request.setAttribute("userid", userid);

            // 다음 필터로 넘기기
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            // 토큰이 없거나 유효하지 않은 경우 403 Forbidden 반환
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "token:error");
        }
    }
}
