package com.example.restcontroller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.service.BestSellerBookService;
import com.example.util.TokenComponent;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api2/bestsellerbook")
@RequiredArgsConstructor
public class BestSellerBookRestController {


  private final TokenComponent tComponent;
  private final BestSellerBookService bestSellerBookService;

  // 127.0.0.1:8080/api2/bestsellerbook/insert
  /*
   {
        "ino": 7,
        "rank": 1,
        "note": "6월 1위 선정 도서"
    }
   */

  // ✅ 등록
  @PostMapping("/insert")
  public Map<String, Object> insert(@RequestHeader("Authorization") String token,
                                    @RequestBody Map<String, Object> req) {
      Map<String, Object> map = new HashMap<>();
      try {
          token = token.replace("Bearer ", "");
          Map<String, Object> user = tComponent.validate(token);
          if (!"1".equals(user.get("admin").toString())) {
                throw new RuntimeException("관리자만 등록 가능합니다.");
            }

          Long ino = Long.parseLong(req.get("ino").toString());
          Integer rank = Integer.parseInt(req.get("rank").toString());
          String note = (String) req.getOrDefault("note", "");

          bestSellerBookService.insertBestSeller(ino, rank, note);
          map.put("status", 1);
      } catch (Exception e) {
          map.put("status", -1);
          map.put("error", e.getMessage());
      }
      return map;
  }

    // ✅ 베스트셀러 목록 조회
    @GetMapping("/selectlist")
    public Map<String, Object> getBestSellers() {
        Map<String, Object> map = new HashMap<>();
        try {
            List<Map<String, Object>> resultList = bestSellerBookService.getBestSellerList();
            map.put("status", 1);
            map.put("list", resultList);
        } catch (Exception e) {
            map.put("status", -1);
            map.put("error", e.getMessage());
        }
        return map;
    }

  // 127.0.0.1:8080/api2/bestsellerbook/selectone?no=1
  @GetMapping("/selectone")
    public Map<String, Object> getBestSellerOne(
        @RequestHeader(value = "Authorization", required = false) String token,
        @RequestParam("no") Long no) {
        Map<String, Object> map = new HashMap<>();
    try {
        if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                Map<String, Object> user = tComponent.validate(token);
                // 일반 회원, 관리자 모두 가능 (관리자 권한 검사 생략)
            }
            
        Map<String, Object> result = bestSellerBookService.getBestSellerOne(no);
        // 일반 회원, 관리자 모두 가능 (관리자 권한 검사 생략)  
            map.put("status", 1);
            map.put("book", result);
        } catch (Exception e) {
            map.put("status", -1);
            map.put("error", e.getMessage());
        }
        return map;
    }
}
