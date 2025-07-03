package com.example.restcontroller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.entity.Order;
import com.example.entity.PaymentHistoryAction;
import com.example.entity.ReviewAction;
import com.example.repository.OrderRepository;
import com.example.repository.PaymentHistoryActionRepository;
import com.example.repository.ReviewActionRepository;
import com.example.util.TokenComponent;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api2/sorder")
@RequiredArgsConstructor
public class SellerOrderRestController {

  private final TokenComponent tComponent;
  private final OrderRepository oRepository;
  private final ReviewActionRepository reviewActionRepository;
  private final PaymentHistoryActionRepository paymentHistoryActionRepository;
  
  // 127.0.0.1:8080/api2/sorder/selectlist?page=1&cnt=10
  // order에 있는것만 가능
  // 판매자 주문 목록
  /* 
    headers : token
  */
   @GetMapping("/selectlist")
    public Map<String, Object> selectList(
        @RequestHeader("Authorization") String token,
        @RequestParam int page,
        @RequestParam int cnt
    ) {
        Map<String, Object> result = new HashMap<>();
        try {
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // 2. 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());

            // 3. 주문 조회 (판매자 입장에서)
            PageRequest pageRequest = PageRequest.of(page - 1, cnt);
            List<Order> list = oRepository.findByItem_Member_No(mno, pageRequest);

            for (Order obj : list) {
                // 4. 가격 정보 보정
                obj.getItem().setBookprice(obj.getItem().getItemBook().getBookprice());

                // 5. 주문 번호 기준으로 PaymentHistoryAction 조회
                Long orderNo = obj.getNo();
                PaymentHistoryAction pha = paymentHistoryActionRepository.findByOrder_No(orderNo).orElse(null);

                if (pha != null) {
                    // 6. 결제이력 번호로 ReviewAction 조회
                    ReviewAction reviewAction = reviewActionRepository.findByPaymentHistoryAction_No(pha.getNo());
                    if (reviewAction != null) {
                        obj.setReview(reviewAction.getReview());
                    }
                }
            }

            result.put("status", 1);
            result.put("list", list);
        } catch (Exception e) {
            result.put("status", -1);
            result.put("message", e.getMessage());
        }
        return result;
    }

}
