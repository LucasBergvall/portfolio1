package com.example.restcontroller;

import java.util.*;
import org.springframework.web.bind.annotation.*;

import com.example.service.MdRecommendService;
import com.example.util.TokenComponent;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api2/mdrecommend")
@RequiredArgsConstructor
public class MdRecommendRestController {

    private final TokenComponent tComponent;
    private final MdRecommendService recommendService;

    @PutMapping("/update")
    public Map<String, Object> update(@RequestHeader("Authorization") String token,
                                      @RequestBody Map<String, Object> req) {
        Map<String, Object> map = new HashMap<>();
        try {
            token = token.replace("Bearer ", "");
            Map<String, Object> user = tComponent.validate(token);
            if (!"1".equals(user.get("admin").toString())) throw new RuntimeException("관리자만 수정 가능");

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

    @PostMapping("/insert")
    public Map<String, Object> insert(@RequestHeader("Authorization") String token,
                                      @RequestBody Map<String, Object> req) {
        Map<String, Object> map = new HashMap<>();
        try {
            token = token.replace("Bearer ", "");
            Map<String, Object> user = tComponent.validate(token);
            if (!"1".equals(user.get("admin").toString())) throw new RuntimeException("관리자만 등록 가능");

            String groupName = (String) req.get("groupName");
            Long ino = Long.parseLong(req.get("itemNo").toString());
            Integer sortOrder = Integer.parseInt(req.get("sortOrder").toString());

            recommendService.insertRecommendBook(groupName, ino, sortOrder);
            map.put("status", 1);
        } catch (Exception e) {
            map.put("status", -1);
            map.put("error", e.getMessage());
        }
        return map;
    }

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
