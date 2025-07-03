// package com.example.restcontroller;

// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;

// import com.example.entity.Review;
// import com.example.repository.ReviewReplyViewRepository;
// import com.example.repository.ReviewRepository;
// import com.example.util.TokenComponent;

// import lombok.RequiredArgsConstructor;

// import java.util.HashMap;
// import java.util.Map;

// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestHeader;


// @RestController
// @RequestMapping("/api2/reply")
// @RequiredArgsConstructor
// public class ReviewReplyRestController {
  
//   private final TokenComponent tComponent;
//   private final ReviewReplyViewRepository reviewReplyViewRepository;
//   private final ReviewRepository reviewRepository;
  
//   // 127.0.0.1:8080/api2/reply/update
//   // headers token
//   /*
//     {
//       "no": 4,
//       "reviewAnswer" : "답글"
//     }

//     삭제시 
//     {
//       "no": 4,
//       "reviewAnswer" : null
//     }
//   */

//   @PutMapping(value = "/update")
//     public Map<String, Object> insertPOST(
//         @RequestBody Review review,
//         @RequestHeader("Authorization") String token) {
//         Map<String, Object> map = new HashMap<>();
//          try {
//             // 1. 토큰에서 Bearer 제거
//             if (token.startsWith("Bearer ")) {
//                 token = token.substring(7);
//             }
//             // 2. 토큰에서 사용자 정보 추출
//             Map<String, Object> userInfo = tComponent.validate(token);
//             Long mno = Long.parseLong(userInfo.get("mno").toString());
//             int seller = Integer.parseInt(userInfo.get("seller").toString());
            
//             map.put("status", 0);
//             map.put("message", "권한이 없습니다.");
//             if(seller == 1) {
//               if(reviewReplyViewRepository.existsByMnoAndNo(mno, review.getNo())) {
//                 Review review1 = reviewRepository.findById(review.getNo()).orElse(null);
//                 review1.setReviewAnswer(review.getReviewAnswer());
//                 reviewRepository.save(review1);
//                 map.put("status", 1);
//                 map.put("message", "등록이 성공 했습니다.");
//               }
//             }
//         } catch (Exception e) {
//             map.put("status", -1);
//             map.put("message", e.getMessage());
//         }
//         return map;
//     }

  
// }
