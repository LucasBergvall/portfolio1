package com.example.restcontroller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.entity.Cart;
import com.example.entity.Item;
import com.example.entity.Member;
import com.example.projection.CartGroupProjection;
import com.example.repository.CartRepository;
import com.example.repository.ItemRepository;
import com.example.util.TokenComponent;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api2/cart")
@RequiredArgsConstructor
public class CartRestController {

  private final CartRepository cartRepository;
  private final TokenComponent tComponent;
  private final ItemRepository itemRepository;

  // 장바구니
  // 127.0.0.1:8080/api2/cart/selectlist?page=1&cnt=10
  // headers token

  @GetMapping("/selectlist")
  public Map<String, Object> selectList(
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

          // ✅ 페이지 객체 생성
          Pageable pageable = PageRequest.of(page - 1, cnt);

          // ✅ 페이징 적용된 결과 조회
          Page<CartGroupProjection> resultPage = cartRepository.findGroupedBySeller(mno, pageable);

          // ✅ Stream으로 판매자 그룹핑
          Map<String, List<Map<String, Object>>> groupedMap = resultPage.getContent().stream()
              .map(proj -> {
                  Map<String, Object> itemMap = new HashMap<>();
                  itemMap.put("cartNo", proj.getCartNo());
                  itemMap.put("itemNo", proj.getItemNo());
                  itemMap.put("title", proj.getTitle());
                  itemMap.put("quantity", proj.getQuantity());
                  itemMap.put("bookprice", proj.getBookprice());
                  itemMap.put("discount", proj.getDiscount());
                  itemMap.put("sellerNickname", proj.getSellerNickname());
                  itemMap.put("imgDefault", proj.getImgDefault());
                  return itemMap;
              })
              .collect(Collectors.groupingBy(item -> (String) item.get("sellerNickname")));

          map.put("status", 1);
          map.put("list", groupedMap);
          map.put("itemCnt", resultPage.getTotalElements());
          map.put("totalPages", resultPage.getTotalPages());
          map.put("currentPage", resultPage.getNumber() + 1);
      } catch (Exception e) {
          map.put("status", -1);
          map.put("message", e.getMessage());
      }
      return map;
  }





  // 127.0.0.1:8080/api2/cart/delete
  /* 
    {
      "no" : 1
    }
  */
  @DeleteMapping(value = "/delete")
    public Map<String, Object> cartDelete(
        @RequestHeader("Authorization") String token,
        @RequestBody Cart obj
    ) {
        Map<String, Object> map = new HashMap<>();
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            cartRepository.deleteByNoAndMember_No(obj.getNo(), mno);
            map.put("status", 1);
            map.put("message", "삭제 완료");
        } catch (Exception e) {
            map.put("status", 0);
            map.put("message", e.getMessage());
          }
            return map;
    }



  // 127.0.0.1:8080/api2/cart/update
  /* 
    {
      "no" : 1,
      "quantity" : 3
    }  
  */

  @PutMapping(value = "/update")
    public Map<String, Object> updateItemMap(
        @RequestHeader("Authorization") String token,
        @RequestBody Cart obj
    ) {
        Map<String, Object> map = new HashMap<>();
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            Cart cart = cartRepository.findByNoAndMember_No(obj.getNo(), mno);
            cart.setQuantity(obj.getQuantity());
            cartRepository.save(cart);
            map.put("status", 1);
            map.put("message", "수정 완료");
        } catch (Exception e) {
            map.put("status", 0);
            map.put("message", e.getMessage());
          }
            return map;
    }

  

  
  // 127.0.0.1:8080/api2/cart/insert
  // header : token, body : item
  /* 
  {
    "quantity" : 1,
    "item" : {"no" : 8}
  }
  */ 

  //  @PostMapping(value = "/insert")
  //   public Map<String, Object> insertPOST(
  //       @RequestHeader("Authorization") String token,    
  //       @RequestBody Cart cart) {
  //       Map<String, Object> map = new HashMap<>();
  //        try {
  //           // 1. 토큰에서 Bearer 제거
  //           if (token.startsWith("Bearer ")) {
  //               token = token.substring(7);
  //           }
  //           // 2. 토큰에서 사용자 정보 추출
  //           Map<String, Object> userInfo = tComponent.validate(token);
  //           Long mno = Long.parseLong(userInfo.get("mno").toString());

  //           // 물품 존재 여부 확인
  //           if(!itemRepository.existsById(cart.getItem().getNo())) {
  //             map.put("status", 0);
  //             map.put("message", "존재하지 않는 상품입니다.");
  //             return map;
  //           }

  //           // 중복 담기 확인
  //           boolean exists = cartRepository.existsByMember_NoAndItem_No(mno, cart.getItem().getNo());
  //           if(exists) {
  //             map.put("status", 0);
  //             map.put("message", "존재하지 않는 상품입니다.");
  //             return map;
  //           }
            
  //           Member member = new Member();
  //           member.setNo(mno);
  //           cart.setMember(member);
  //           cartRepository.save(cart);

  //           map.put("status", 1);
  //           map.put("message", "등록이 성공 했습니다.");
            
  //         } catch (Exception e) {
  //             map.put("status", -1);
  //             map.put("message", e.getMessage());
  //         }
  //         return map;
  //   }

  @PostMapping(value = "/insert")
    public Map<String, Object> insertPOST(
      @RequestHeader("Authorization") String token,    
      @RequestBody Cart cartRequest) {

      Map<String, Object> map = new HashMap<>();
      try {
          // 1. 토큰에서 Bearer 제거
          if (token.startsWith("Bearer ")) {
              token = token.substring(7);
          }

          // 2. 토큰에서 사용자 정보 추출
          Map<String, Object> userInfo = tComponent.validate(token);
          Long mno = Long.parseLong(userInfo.get("mno").toString());

          Long ino = cartRequest.getItem().getNo();

          // 3. 물품 존재 여부 확인
          if (!itemRepository.existsById(ino)) {
              map.put("status", 0);
              map.put("message", "존재하지 않는 상품입니다.");
              return map;
          }

          // 4. 중복 담기 확인
          Optional<Cart> existingCart = cartRepository.findByMember_NoAndItem_No(mno, ino);
          if (existingCart.isPresent()) {
              // 이미 담긴 경우 → 수량 증가
              Cart exist = existingCart.get();
              exist.setQuantity(exist.getQuantity() + 1);
              cartRepository.save(exist);
          } else {
              // 새로 담는 경우 (완전 새 객체 생성)
              Cart newCart = new Cart();

              Member member = new Member();
              member.setNo(mno);

              Item item = new Item();
              item.setNo(ino);

              newCart.setMember(member);
              newCart.setItem(item);
              newCart.setQuantity(1);

              cartRepository.save(newCart);
          }

          map.put("status", 1);
          map.put("message", "장바구니에 담기 완료");

      } catch (Exception e) {
          map.put("status", -1);
          map.put("message", e.getMessage());
      }
      return map;
    }

}
