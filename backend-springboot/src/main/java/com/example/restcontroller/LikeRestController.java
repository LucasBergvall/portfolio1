package com.example.restcontroller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.LikeItemDTO;
import com.example.entity.Item;
import com.example.entity.Like;
import com.example.entity.Member;
import com.example.repository.LikeRepository;
import com.example.util.TokenComponent;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api2/like")
@RequiredArgsConstructor
public class LikeRestController {
  // 즐겨찾기

  private final LikeRepository likeRepository;
  private final TokenComponent tComponent;
  // 127.0.0.1:8080/api2/like/selectlist?page=1&cnt=1000
  // headers token

  @GetMapping("/selectlist")
    public Map<String, Object> selectList(
        @RequestHeader("Authorization") String token,
        @RequestParam(required = false, defaultValue = "1") int page,
        @RequestParam(required = false, defaultValue = "1000") int cnt) {
        Map<String, Object> map = new HashMap<>();
        try {
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());

            // 페이징 처리
            PageRequest pageRequest = PageRequest.of(page - 1, cnt);
            Page<Object[]> resultPage = likeRepository.findByMemberNoNative(mno, pageRequest);
            
            // 결과 DTO 변환
           List<LikeItemDTO> dtoList = resultPage.getContent().stream()
            .map(row -> LikeItemDTO.builder()
                .likeNo(((Number) row[0]).longValue())
                .itemNo(((Number) row[1]).longValue())
                .title((String) row[2])
                .bookprice(row[3] != null ? ((Number) row[3]).intValue() : 0)
                .imageNo(row[4] != null ? ((Number) row[4]).longValue() : null)  // ✅ imageNo로 변경
                .discount(row[5] != null ? ((Number) row[5]).intValue() : 0)  // ✅ discount 추가
                .build())
            .collect(Collectors.toList());
            map.put("status", 1);
            map.put("list", dtoList);
            map.put("totalPages", resultPage.getTotalPages());
            map.put("totalElements", resultPage.getTotalElements());
            map.put("currentPage", page);
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }





  // 127.0.0.1:8080/api2/like/delete
  //123
  /* 
  {
    "item": { "no": 8 }
  }
  */
    @DeleteMapping(value = "/delete")
    public Map<String, Object> LikeDelete(
        @RequestHeader("Authorization") String token,
        @RequestBody Like obj
    ) {
        Map<String, Object> map = new HashMap<>();
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());

            // 해당 멤버의 item_no를 기준으로 삭제
            likeRepository.deleteByMember_NoAndItem_No(mno, obj.getItem().getNo());

            map.put("status", 1);
            map.put("message", "삭제 완료");
        } catch (Exception e) {
            map.put("status", 0);
            map.put("message", e.getMessage());
        }
        return map;
    }





  
  // 127.0.0.1:8080/api2/like/insert
  // header : token, body : item
  /* 
  {
    "item" : {"no" : 8}
  }
  */ 

    @PostMapping(value = "/insert")
    public Map<String, Object> insertPOST(
        @RequestHeader("Authorization") String token,    
        @RequestBody Like like) {
        Map<String, Object> map = new HashMap<>();
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());

            // 기존 아이템이 있는지 확인
            boolean exists = likeRepository.existsByMember_NoAndItemNo(mno, like.getItem().getNo());
            if (exists) {
                map.put("status", 0);
                map.put("message", "이미 등록된 항목입니다.");
                return map;
            }

            // 새로운 항목 추가
            Member member = new Member();
            member.setNo(mno);
            like.setMember(member);
            likeRepository.save(like);

            map.put("status", 1);
            map.put("message", "등록이 성공했습니다.");
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }

}
