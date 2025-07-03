package com.example.restcontroller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.example.service.PublisherRecommendService;
import com.example.util.TokenComponent;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api2/recommend")
@RequiredArgsConstructor
public class PublisherRecommendRestController {

    private final TokenComponent tComponent;
    private final PublisherRecommendService recommendService;

  //127.0.0.1:8080/api2/recommend/update

  @PutMapping("/update")
  public Map<String, Object> update(@RequestHeader("Authorization") String token,
                                    @RequestBody Map<String, Object> req) {
      Map<String, Object> map = new HashMap<>();
      try {
          token = token.replace("Bearer ", "");
          Map<String, Object> user = tComponent.validate(token);
          if (!"1".equals(user.get("admin").toString())) {
              throw new RuntimeException("관리자만 수정 가능합니다.");
          }

          Long recommendId = Long.parseLong(req.get("recommendId").toString());
          Integer sortOrder = Integer.parseInt(req.get("sortOrder").toString());

          recommendService.updateSortOrder(recommendId, sortOrder);
          map.put("status", 1);
      } catch (Exception e) {
          map.put("status", -1);
          map.put("error", e.getMessage());
      }
      return map;
  }

  // 127.0.0.1:8080/api2/recommend/insert
  // headers : Bearer 
  // body :
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

          String groupName = (String) req.get("groupName");  // 예: "출판사추천"
          Long ino = Long.parseLong(req.get("itemNo").toString());
          Integer sortOrder = Integer.parseInt(req.get("sortOrder").toString());

          // ✅ note 부분 완전히 제거

          recommendService.insertRecommendBook(groupName, ino, sortOrder);
          map.put("status", 1);
      } catch (Exception e) {
          map.put("status", -1);
          map.put("error", e.getMessage());
      }
      return map;
  }


  // 그룹별 목록 조회
  @GetMapping("/group/{groupName}")
  public Map<String, Object> getList(@PathVariable String groupName) {
      Map<String, Object> map = new HashMap<>();
      try {
          List<Map<String, Object>> result = recommendService.getRecommendBookList(groupName);
          map.put("status", 1);
          map.put("list", result);
      } catch (Exception e) {
          map.put("status", -1);
          map.put("error", e.getMessage());
      }
      return map;
  }

  // 상세 조회
  @GetMapping("/selectone")
  public Map<String, Object> getOne(@RequestParam("no") Long recommendBookId) {
      Map<String, Object> map = new HashMap<>();
      try {
          Map<String, Object> result = recommendService.getRecommendBookOne(recommendBookId);
          map.put("status", 1);
          map.put("book", result);
      } catch (Exception e) {
          map.put("status", -1);
          map.put("error", e.getMessage());
      }
      return map;
  }
}
