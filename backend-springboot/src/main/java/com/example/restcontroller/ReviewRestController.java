package com.example.restcontroller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.ReviewListDTO;
import com.example.entity.Member;
import com.example.entity.PaymentHistoryAction;
import com.example.entity.Review;
import com.example.entity.ReviewAction;
import com.example.repository.MemberRepository;
import com.example.repository.PaymentHistoryActionRepository;
import com.example.repository.ReviewActionRepository;
import com.example.repository.ReviewRepository;
import com.example.service.ReviewServiceImpl;
import com.example.util.TokenComponent;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api2/review")
@RequiredArgsConstructor
public class ReviewRestController {

  private final TokenComponent tComponent;
  private final ReviewServiceImpl reviewServiceImpl;
  private final MemberRepository memberRepository;
  private final ReviewRepository reviewRepository;
  private final ReviewActionRepository reviewActionRepository;
  private final PaymentHistoryActionRepository paymentHistoryActionRepository;



  
  // 리뷰
  // 삭제
  // 127.0.0.1:8080/api2/review/delete
  // headers token
  /*
    {
      "no": 1
    }
  */
@DeleteMapping("/delete")
public Map<String, Object> reviewDELETE(
        @RequestHeader("Authorization") String token,
        @RequestBody Review obj){
        Map<String, Object> map = new HashMap<>();
        try {
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            int buyer = Integer.parseInt(userInfo.get("buyer").toString());

            map.put("status", 0);
            map.put("message", "권한이 없습니다.");

            if(buyer == 1){
              reviewServiceImpl.deleteReview(obj.getNo(), mno);
              map.put("status", 1);
              map.put("message", "삭제가 성공 했습니다.");
            } 
        } catch(Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }




  // 127.0.0.1:8080/api2/review/insert
  /* 
   {
    "review" : "리뷰~",
    "evaluation" : 5
   } 
  */
  /*{
      "paymentHistory" : {"no" : 2}
    } 
   */
  // @PostMapping("/insert")
  // public Map<String, Object> getItemdetail(
  //   @RequestHeader("Authorization") String token,
  //   @RequestPart("review") Review review,
  //   @RequestPart("reviewaction") ReviewAction reviewAction ) {
  //     System.out.println(review.toString());
  //     System.out.println(reviewAction.toString());
  //     Map<String, Object> map = new HashMap<>();
  //       try {
  //           // 1. 토큰에서 Bearer 제거
  //           if (token.startsWith("Bearer ")) {
  //               token = token.substring(7);
  //           }
  //           // 2. 토큰에서 사용자 정보 추출
  //           Map<String, Object> userInfo = tComponent.validate(token);
  //           Long mno = Long.parseLong(userInfo.get("mno").toString());
  //           int buyer = Integer.parseInt(userInfo.get("buyer").toString());
  //               map.put("status", 0);
  //               map.put("message", "권한이 없습니다.");
  //           if(buyer == 1){
  //               Member member = new Member();
  //               member.setNo(mno);
  //               reviewAction.setMember(member);
  //               reviewServiceImpl.insertReview(review, reviewAction);
  //               map.put("status", 1);
  //               map.put("message", "등록 성공 했습니다.");
  //           }            
  //       } catch(Exception e) {
  //           map.put("status", -1);
  //           map.put("message", e.getMessage());
  //       }
  //       return map;
  //   }

  @PostMapping("/insert")
  public Map<String, Object> insertReview(
      @RequestHeader("Authorization") String token,
      @RequestPart("review") Review review,
      @RequestPart("reviewaction") ReviewAction reviewAction) {

      Map<String, Object> map = new HashMap<>();
      try {
          if (token.startsWith("Bearer ")) {
              token = token.substring(7);
          }
          Map<String, Object> userInfo = tComponent.validate(token);
          Long mno = Long.parseLong(userInfo.get("mno").toString());
          int buyer = Integer.parseInt(userInfo.get("buyer").toString());

          if (buyer != 1) {
              map.put("status", 0);
              map.put("message", "구매자만 리뷰 작성 가능");
              return map;
          }

          if (reviewAction.getPaymentHistoryAction() == null || 
              reviewAction.getPaymentHistoryAction().getNo() == null) {
              map.put("status", -1);
              map.put("message", "결제 정보가 누락되었습니다. 다시 시도해주세요.");
              return map;
          }

          Long phano = reviewAction.getPaymentHistoryAction().getNo();

          // 이미 작성된 리뷰인지 확인
          boolean exists = reviewActionRepository.existsByPaymentHistoryAction_NoAndMember_No(phano, mno);
          if (exists) {
              map.put("status", 0);
              map.put("message", "이미 리뷰를 작성한 주문입니다.");
              return map;
          }

          // 1. PaymentHistoryAction을 ID로 조회
          PaymentHistoryAction pha = paymentHistoryActionRepository.findById(phano)
              .orElseThrow(() -> new RuntimeException("결제 이력 없음"));

          // 2. 주문자(member.no)와 로그인한 유저(mno) 일치 여부 검증
          Long orderMemberNo = pha.getOrder().getMember().getNo();
          if (!orderMemberNo.equals(mno)) {
              map.put("status", 0);
              map.put("message", "이 결제 내역은 회원님의 것이 아닙니다.");
              return map;
          }

          // 6. 회원 정보 조회
          Member member = memberRepository.findById(mno)
            .orElseThrow(() -> new RuntimeException("회원 정보를 찾을 수 없습니다."));


          // 리뷰 저장
          Review savedReview = reviewRepository.save(review);

          // 리뷰 액션 저장
          reviewAction.setMember(member);
          reviewAction.setReview(savedReview);
          reviewAction.setPaymentHistoryAction(pha);
          reviewActionRepository.save(reviewAction);

          map.put("status", 1);
          map.put("message", "리뷰가 등록되었습니다.");
          return map;

      } catch (Exception e) {
          e.printStackTrace();
          map.put("status", -1);
          map.put("message", "서버 오류: " + e.getMessage());
          return map;
      }
  }


  @GetMapping("/list")
    public Map<String, Object> reviewList(
    @RequestHeader("Authorization") String token,
    @RequestParam int page,
    @RequestParam int cnt) {
    
    Map<String, Object> map = new HashMap<>();
    try {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        Map<String, Object> userInfo = tComponent.validate(token);
        Long mno = Long.parseLong(userInfo.get("mno").toString());

        PageRequest pageRequest = PageRequest.of(page - 1, cnt);
        Page<ReviewListDTO> pageResult = reviewActionRepository.findMyReviewsWithItem(mno, pageRequest);

        map.put("status", 1);
        map.put("list", pageResult.getContent());
        map.put("totalCount", pageResult.getTotalElements()); // ⚠️ 총 개수 추가
    } catch (Exception e) {
        map.put("status", -1);
        map.put("message", e.getMessage());
    }
    return map;
    }




  @GetMapping("/exists")
  public Map<String, Object> checkReviewExists(
      @RequestHeader("Authorization") String token,
      @RequestParam("phano") Long phano) {

      Map<String, Object> map = new HashMap<>();
      try {
          if (token.startsWith("Bearer ")) {
              token = token.substring(7);
          }
          Map<String, Object> userInfo = tComponent.validate(token);
          Long mno = Long.parseLong(userInfo.get("mno").toString());

          boolean exists = reviewActionRepository.existsByPaymentHistoryAction_NoAndMember_No(phano, mno);
          map.put("status", 1);
          map.put("exists", exists);
      } catch (Exception e) {
          map.put("status", -1);
          map.put("message", e.getMessage());
      }
      return map;
  }
}
