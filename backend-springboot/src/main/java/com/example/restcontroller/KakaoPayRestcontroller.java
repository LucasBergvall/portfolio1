package com.example.restcontroller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.apache.catalina.manager.util.SessionUtils;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.dto.KakaoPay.KakaoApproveDTO;
import com.example.dto.KakaoPay.KakaoPayDTO;
import com.example.entity.Cart;
import com.example.entity.Item;
import com.example.entity.Member;
import com.example.entity.Order;
import com.example.entity.PaymentHistory;
import com.example.entity.PaymentHistoryAction;
import com.example.repository.CartRepository;
import com.example.repository.ItemRepository;
import com.example.repository.MemberRepository;
import com.example.repository.OrderRepository;
import com.example.repository.PaymentHistoryActionRepository;
import com.example.repository.PaymentHistoryRepository;
import com.example.service.OrderSeqService;
import com.example.util.TokenComponent;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api2/pay")
public class KakaoPayRestcontroller {

    private final CartRepository cartRepository;
    private final HttpSession httpSession;
    private final TokenComponent tComponent;
    private final OrderSeqService orderSeqService;
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final MemberRepository memberRepository;
    private final ItemRepository itemRepository;
    private final OrderRepository orderRepository;
    private final PaymentHistoryActionRepository paymentHistoryActionRepository;
    
    // 127.0.0.1:8080/api2/checkout/pay/ready
    // headers : Bearer token
    /* const body = [1,2,3] 
    */ 
    @SuppressWarnings("null")
    @PostMapping("/ready")
    public Map<String, Object> payReady(
      @RequestHeader("Authorization") String token, 
      @RequestBody List<Long> cno) {
      Map<String, Object> map = new HashMap<>();

      try {
        System.out.println(cno);

        List<Cart> cart = cartRepository.findByNoIn(cno);
        // System.out.println(cart.toString());
        int cnt = 0;
        int totalPrice = 0;
        for(Cart obj : cart) {
          cnt += obj.getQuantity();
          totalPrice += obj.getQuantity() * obj.getItem().getItemBook().getBookprice();
          System.out.println(obj.getNo() + " " + obj.getItem().getItemBook().getBookprice()+" "+obj.getItem().getTitle());
        }
        System.out.println(cnt);
        System.out.println(totalPrice);
        Long orderNo = orderSeqService.getNextOrderNo(); 
        Map<String, String> parameters = new HashMap<>();
        parameters.put("cid", "TC0ONETIME");                                                                        // 가맹점 코드(테스트용)
        parameters.put("partner_order_id", String.valueOf(orderNo));                                                      // 주문번호
        parameters.put("partner_user_id", String.valueOf(cart.get(0).getMember().getNo()));                         // 회원 아이디
        parameters.put("item_name", cart.get(0).getItem().getTitle()+"외 "+(cart.size()-1));                        // 상품명
        parameters.put("quantity", String.valueOf(cnt));                                                                  // 상품 수량
        parameters.put("total_amount", String.valueOf(totalPrice));                                                     
        // parameters.put("total_amount", String.valueOf("500"));                                                            // 상품 총액
        parameters.put("vat_amount", "200");                                                                        // 비과세 총액
        parameters.put("tax_free_amount", "0");                                                                     // 상품 비과세 금액
        // parameters.put("approval_url", "http://localhost:8080/api2/pay/completed");                                        // 결제 성공 시 URL
        // parameters.put("cancel_url", "http://localhost:8080/api2/pay/cancel");                                             // 결제 취소 시 URL
        // parameters.put("fail_url", "http://localhost:8080/api2/pay/fail");                                                 // 결제 실패 시 URs

        parameters.put("approval_url", "http://localhost:3000/kakaopay/completed");                                 // 결제 성공 시 URL
        parameters.put("cancel_url", "http://localhost:3000/kakaopay/cancel");                                      // 결제 취소 시 URL
        parameters.put("fail_url", "http://localhost:3000/kakaopay/fail"); 
        // System.out.println(parameters.toString());
        

        // HttpEntity : HTTP 요청 또는 응답에 해당하는 Http Header와 Http Body를 포함하는 클래스
        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(parameters, this.getHeaders());

        // RestTemplate
        // : Rest 방식 API를 호출할 수 있는 Spring 내장 클래스
        //   REST API 호출 이후 응답을 받을 때까지 기다리는 동기 방식 (json, xml 응답)
        RestTemplate template = new RestTemplate();
        String url = "https://open-api.kakaopay.com/online/v1/payment/ready";
        
        // RestTemplate의 postForEntity : POST 요청을 보내고 ResponseEntity로 결과를 반환받는 메소드
        ResponseEntity<KakaoPayDTO> responseEntity = template.postForEntity(url, requestEntity, KakaoPayDTO.class);
        log.info("결제준비 응답객체: " + responseEntity.getBody());
        KakaoPayDTO kakaoPayDTO = responseEntity.getBody();

        // 여기서 tid 추출
        String tid = kakaoPayDTO.getTid();
        httpSession.setAttribute("tid",  tid);
        httpSession.setAttribute("orderNo", orderNo);
        httpSession.setAttribute("cno", cno);  // 장바구니 번호도 세션에 저장

        map.put("status", 1);
        map.put("message", responseEntity.getBody());  
        
      } catch (Exception e) {
        System.out.println(e.getStackTrace());
        map.put("status", -1);
        map.put("message", e.getLocalizedMessage()); 
      }
      
      return map;
    } 

    // 127.0.0.1:8080/api2/pay/completed?pg_token

    @SuppressWarnings("null")
    @GetMapping("/completed")
    public Map<String, Object> payCompleted(
      @RequestHeader("Authorization") String token,  
      @RequestParam("pg_token") String pgToken) {
      System.out.println(pgToken);
      Map<String, Object> map = new HashMap<>();
      try {
        if (token.startsWith("Bearer ")) {
                token = token.substring(7);
        }
        Map<String, Object> userInfo = tComponent.validate(token);
        Long mno = Long.parseLong(userInfo.get("mno").toString());

        String tid = (String)httpSession.getAttribute("tid");
        Long orderNo = (Long)httpSession.getAttribute("orderNo");
        @SuppressWarnings("unchecked")
        List<Long> cno = (List<Long>) httpSession.getAttribute("cno");

        Map<String, String> parameters = new HashMap<>();
        parameters.put("cid", "TC0ONETIME");                                                                              // 가맹점 코드(테스트용)
        parameters.put("tid", tid);                                                                                             // 결제 고유번호
        parameters.put("partner_order_id", String.valueOf(orderNo));                                                            // 주문번호
        parameters.put("partner_user_id", String.valueOf(mno));                                                                 // 회원 아이디
        parameters.put("pg_token", pgToken);                                                                                    // 결제승인 요청을 인증하는 토큰

        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(parameters, this.getHeaders());

        RestTemplate template = new RestTemplate();
        String url = "https://open-api.kakaopay.com/online/v1/payment/approve";
        KakaoApproveDTO approveResponse = template.postForObject(url, requestEntity, KakaoApproveDTO.class);
        System.out.println(approveResponse.toString());


        // Long oNo = Long.parseLong(approveResponse.getPartner_order_id());

        PaymentHistory payment = new PaymentHistory();

        payment.setAid(approveResponse.getAid());
        payment.setTid(approveResponse.getTid());
        payment.setCid(approveResponse.getCid());
        payment.setPartnerOrderId(approveResponse.getPartner_order_id());
        payment.setPartnerUserId(approveResponse.getPartner_user_id());
        payment.setPaymentMethodType(approveResponse.getPayment_method_type());
        payment.setItemName(approveResponse.getItem_name());
        payment.setItemCode(approveResponse.getItem_code());
        payment.setQuantity(approveResponse.getQuantity());
        payment.setCreatedAt(approveResponse.getCreated_at());
        payment.setApprovedAt(approveResponse.getApproved_at());
        payment.setPayload(approveResponse.getPayload());

        payment.setPay(1); // 결제 성공
        payment.setRefund(0); // 환불 없음
        payment.setCard(""); // 카드번호는 지금 미수집 (향후 추가 가능)

        System.out.println("==================================================");
        System.out.println(payment.toString());
        System.out.println("==================================================");
        PaymentHistory paymentHistory = paymentHistoryRepository.save(payment);

        System.out.println(cno.toString());
        // 카트에 담긴 갯수만큼 돌고 
        for(Long c : cno){

          // 주문 테이블에 넣을 데이터
          Order order = new Order(); 
          // order.setPaymentHistory(paymentHistory);
          Cart cart2 = cartRepository.findById(c).orElse(null);
          order.setItem(cart2.getItem());
          Member member = memberRepository.findById(mno).orElse(null);
          order.setMember(member);
          order.setQuantity((long) cart2.getQuantity());
          order.setRegdate(new Date());
          Order order2 = orderRepository.save(order); // order저장소 저장
          
          // 주문액션 테이블에 넣을 데이터
          PaymentHistoryAction paymentHistoryAction = new PaymentHistoryAction();
          paymentHistoryAction.setOrder(order2);
          paymentHistoryAction.setPaymentHistory(paymentHistory);
          paymentHistoryActionRepository.save(paymentHistoryAction);

          // 아이템 수량 변경
          Item item1 =  cart2.getItem();
          item1.setStock(item1.getStock() - cart2.getQuantity());
          itemRepository.save(item1); // item 저장소에서 stock에서 구매한 quantity만큼 차감

          // 장바구니 결제 후 결제완료 물품 삭제
          cartRepository.deleteById(cart2.getNo()); // 카트 지우기
        }

        httpSession.removeAttribute("tid");
        httpSession.removeAttribute("orderNo");
        httpSession.removeAttribute("cno");

        map.put("status", 1);
        map.put("message", approveResponse); 

      } catch (Exception e) {
        System.out.println(e.getStackTrace());
        map.put("status", -1);
        map.put("message", e.getLocalizedMessage()); 
      }
        return map;
    }

    private HttpHeaders getHeaders() {
      HttpHeaders headers = new HttpHeaders();
      headers.set("Authorization", "SECRET_KEY DEV7BE809C12E5DFB9FB5311C4F91DA0A7BD20E8");
      headers.set("Content-type", "application/json;charset=UTF-8");

      return headers;
    }
}
