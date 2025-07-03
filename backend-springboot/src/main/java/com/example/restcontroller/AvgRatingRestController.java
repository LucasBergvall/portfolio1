// package com.example.restcontroller;

// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.example.repository.ReviewActionRepository;
// import com.example.repository.ReviewReplyViewRepository;
// import com.example.repository.ReviewRepository;
// import com.example.util.TokenComponent;

// import lombok.RequiredArgsConstructor;

// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;


// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestHeader;


// @RestController
// @RequestMapping("/api2/avgrating")
// @RequiredArgsConstructor
// public class AvgRatingRestController {

    
//   private final TokenComponent tComponent;
//   private final ReviewReplyViewRepository reviewReplyViewRepository;
//   private final ReviewRepository reviewRepository;


//   // 평균별점(본인 판매 상품에 대한 별점의 평균)
//   // 127.0.0.1:8080/api2/avgrating/stars
//   // headers token
//     @GetMapping("/stars")
//     public Map<String, Object> selectList(
//        @RequestHeader("Authorization") String token ) {
//         Map<String, Object> map = new HashMap<>();
//         try {
//             // 1. 토큰에서 Bearer 제거
//             if (token.startsWith("Bearer ")) {
//                 token = token.substring(7);
//             }
//             // 2. 토큰에서 사용자 정보 추출
//             Map<String, Object> userInfo = tComponent.validate(token);
//             Long mno = Long.parseLong(userInfo.get("mno").toString());
//             int seller = Integer.parseInt(userInfo.get("seller").toString());
//             System.out.println(seller);
//             map.put("status", 0);
//             map.put("message", "권한이 없습니다.");

//             if(seller == 1){
//                 List<Long> list = reviewReplyViewRepository.findByMno(mno);
//                 Double avgEvaluation = reviewRepository.findAverageEvaluationByNos(list);
                
//                 System.out.println(list.toString());
//                 map.put("status", 1);
//                 map.put("avg", avgEvaluation);
//                 map.put("message", "조회완료");
//             }
            
//         } catch(Exception e) {
//             map.put("status", -1);
//             map.put("message", e.getMessage());
//         }
//         return map;
//     }
  


// }
