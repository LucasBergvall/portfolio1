package com.example.restcontroller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.domain.Sort;

import com.example.entity.Order;
import com.example.entity.PaymentHistoryAction;
import com.example.repository.OrderRepository;
import com.example.repository.PaymentHistoryActionRepository;
import com.example.repository.ReviewActionRepository;
import com.example.util.TokenComponent;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api2/buyorder")
@RequiredArgsConstructor
public class BuyerOrderRestController {

  private final TokenComponent tComponent;
  private final OrderRepository oRepository;
  private final ReviewActionRepository reviewActionRepository;
  private final PaymentHistoryActionRepository paymentHistoryActionRepository;

  // 127.0.0.1:8080/api2/buyorder/selectlist?page=1&cnt=10
  // order에 있는것만 가능
  // 판매자 주문 목록
  /* 
    headers : token
  */
  @GetMapping("/selectlist")
  public Map<String, Object> selectList(
      @RequestHeader("Authorization") String token,
      @RequestParam int page,
      @RequestParam int cnt ) {
      System.out.println("AAA");
      
      Map<String, Object> result = new HashMap<>();
      try {
          // 1. 토큰에서 Bearer 제거
          if (token.startsWith("Bearer ")) {
              token = token.substring(7);
          }
          // 2. 토큰에서 사용자 정보 추출
          Map<String, Object> userInfo = tComponent.validate(token);
          Long mno = Long.parseLong(userInfo.get("mno").toString());
          PageRequest pageRequest = PageRequest.of(page-1, cnt, Sort.by(Sort.Direction.DESC, "regdate"));
          
          List<Order> list = oRepository.findByMember_No(mno ,pageRequest);
          System.out.println(list.size());
          for(Order obj : list){
              obj.getItem().setBookprice(obj.getItem().getItemBook().getBookprice());
              obj.getItem().setDefault_img_url(obj.getItem().getItemBook().getDefaultImg());
              Long orderNo = obj.getNo(); // oderNo
              System.out.println(orderNo);
          }
          
          result.put("status", 1);
          result.put("list", list);
          // result.put("default-img", )
      } catch (Exception e) {
          result.put("status", -1);
          result.put("message", e.getMessage());
      }
      return result;
  }

  // 127.0.0.1:8080/api2/buyorder/select?no=주문번호

    @GetMapping("/select")
    public Map<String, Object> selectOne(
        @RequestHeader("Authorization") String token,
        @RequestParam(name = "no") Long orderNo
    ) {
        Map<String, Object> map = new HashMap<>();
        try {
        // 1. 토큰에서 Bearer 제거
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Map<String, Object> userInfo = tComponent.validate(token);
        Long mno = Long.parseLong(userInfo.get("mno").toString());

            // 주문 조회
            Order order = oRepository.findById(orderNo)
                .orElse(null);

            if (order == null) {
                map.put("status", 0);
                map.put("message", "주문 정보가 존재하지 않습니다.");
                return map;
            }

            // 본인 확인
            if (!order.getMember().getNo().equals(mno)) {
                map.put("status", 0);
                map.put("message", "본인의 주문만 조회 가능합니다.");
                return map;
            }

            // 리뷰 존재 여부 체크
            PaymentHistoryAction pha = paymentHistoryActionRepository.findByOrder_No(orderNo).orElse(null);
            if (pha != null) {
                boolean exists = reviewActionRepository.existsByPaymentHistoryAction_NoAndMember_No(pha.getNo(), mno);
                if (exists) {
                    map.put("status", 0);
                    map.put("message", "이미 리뷰를 작성한 주문입니다.");
                    return map;
                }

                // ✅ 여기에 이 줄 추가!
                order.setPaymentHistoryActionNo(pha.getNo());
            }

            // 5. 상품 이미지/가격 보정
            order.getItem().setBookprice(order.getItem().getItemBook().getBookprice());
            order.getItem().setDefault_img_url(order.getItem().getItemBook().getDefaultImg());

            // 6. 응답 반환
            map.put("status", 1);
            map.put("order", order);
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }
  
  
}
