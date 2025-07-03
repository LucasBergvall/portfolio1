package com.example.restcontroller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.entity.Member;
import com.example.entity.Order;
import com.example.repository.OrderRepository;
import com.example.util.TokenComponent;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api2/corder")
@RequiredArgsConstructor
public class CustomerOrderRestcontroller {
  
  private final TokenComponent tComponent;
  private final OrderRepository oRepository;

  // 나의 주문내역 가져오기
  // 127.0.0.1:8080/api2/corder/selectlist?page=1&cnt=10
  // headers : token
  @GetMapping("/selectlist")
    public Map<String, Object> selectList(
        @RequestHeader("Authorization") String token,
        @RequestParam int page,
        @RequestParam int cnt ) {
       
        Map<String, Object> result = new HashMap<>();
        try {
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            PageRequest pageRequest = PageRequest.of(page-1, cnt);
            List<Order> list = oRepository.findByMember_No(mno ,pageRequest);
            result.put("status", 1);
            result.put("list", list);
        } catch (Exception e) {
            result.put("status", -1);
            result.put("message", e.getMessage());
        }
        return result;
    }


  
  // 127.0.0.1:8080/api2/corder/insert
  // 장바구니에 있는것만 가능
  /* 
    {
      "quantity" : 2,
      "item" : { "no" : 5 },
      "paymentHistory" : { "no" : 1 }
    }
  */
  @PostMapping("/insert")
    public Map<String, Object> insertBook(
      @RequestHeader("Authorization") String token,
      @RequestBody Order order
       ) {
        Map<String, Object> map = new HashMap<>();
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            Integer buyer = Integer.parseInt(userInfo.get("buyer").toString());
            Member member = new Member();
            member.setNo(mno);
            order.setMember(member);
            map.put("status", -1);
            map.put("message", "권한이 없습니다.");
            if (buyer == 1) {
                oRepository.save(order);
                map.put("status", 1);
                map.put("message", "책 주문이 완료 되었습니다.");
            }
        } catch (Exception e) {
            map.put("status", 0);
            map.put("message", e.getMessage());
        }
        return map;
    }

}
