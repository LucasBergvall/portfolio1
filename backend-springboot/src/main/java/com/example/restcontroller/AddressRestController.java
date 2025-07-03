package com.example.restcontroller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.entity.Address;
import com.example.entity.Member;
import com.example.repository.AddressRepository;
import com.example.util.TokenComponent;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api2/address")
@RequiredArgsConstructor
public class AddressRestController {

    private final AddressRepository addressRepository;

    private final TokenComponent tComponent;

    // ✅ 내가 등록한 주소 삭제
    // http://127.0.0.1:8080/api2/address/delete
    // const headers = {"Authorization" : "Bearer TOKEN..."}
    // const body = {"no":""}
    @DeleteMapping("/delete")
    public Map<String, Object> deleteAddress(
        @RequestHeader("Authorization") String token,
        @RequestBody Address address) {
        Map<String, Object> map = new HashMap<>();
        
        try {
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            Address addr = addressRepository.findById(address.getNo()).orElse(null);
            map.put("status", 0);
            map.put("message", "기본 주소는 삭제 할 수 없습니다."); // else 기본주소일때 삭제X
            if(!addr.isDefaultAddress()){
                addressRepository.deleteByNoAndMember_No(address.getNo(), mno);
                map.put("status", 1);
                map.put("message", "주소 삭제 완료");   
            }
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }
    
    // ✅ 내가 등록한 주소 조회
    // http://127.0.0.1:8080/api2/address/getinfo
    // const headers = {"Authorization" : "Bearer TOKEN..."}
    @GetMapping("/getinfo")
    public Map<String, Object> getInfo(
        @RequestHeader("Authorization") String token) {
        Map<String, Object> map = new HashMap<>();
         try {
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            // String userid = userInfo.get("userid").toString();
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            List<Address> list = addressRepository.findAllByMember_NoOrderByDefaultAddressDescRegdateAsc(mno);
            map.put("status", 1);
            map.put("list", list);
            map.put("message", "주소 조회 완료");            
        } catch (Exception e) {
            map.put("status", 0);
            map.put("message", e.getMessage());
        }
        
        return map;
    }
    

    // ✅ 대표주소 변경
    // http://127.0.0.1:8080/api2/address/changedefault
    // const headers = {"Authorization" : "Bearer TOKEN..."}
    // const body = {"no": ""} 바꿀 주소 번호
    @PutMapping("/changedefault")
    public Map<String, Object> changeDefault(
        @RequestHeader("Authorization") String token,
        @RequestBody Address address) {
        Map<String, Object> map = new HashMap<>();
        try {
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            // String userid = userInfo.get("userid").toString();
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            System.out.println(mno);
            System.out.println(address.getNo());
            List<Address> list = addressRepository.findAllByMember_NoOrderByDefaultAddressDescRegdateAsc(mno);
            for (Address obj : list) {
                obj.setDefaultAddress(false);
                if(obj.getNo() == address.getNo()) {
                    obj.setDefaultAddress(true);
                }
            }
            addressRepository.saveAll(list);
            map.put("status", 1);
            map.put("message", "기본 배송지 변경 완료");
        } catch (Exception e) {
            map.put("status", 0);
            map.put("message", e.getMessage());
        }
        return map;
    }


    // ✅ 주소 등록(회원가입 시)
    // http://127.0.0.1:8080/api2/address/insert
    // const body = {"address" : "서울","address_detail": "asdasd", "postno" : 34, "member" : {"no": "mno"}} 외래키 받아오는방법
    // Member member 가 외래키니까 member의 no인 mno를 받아오기 위함 
    @PostMapping("/insert")
    public Map<String, Object>  insertAddress(@RequestBody Address addr) {
        Map<String, Object> map = new HashMap<>();
        try {
            // 저장소.save(addr);
            addr.setDefaultAddress(true);
            addressRepository.save(addr);
            map.put("status", 1);
            map.put("message", "주소 등록 완료");            
        } catch (Exception e) {
            map.put("status", 0);
            map.put("message", e.getMessage());
        }
        
        return map;
    }
    

    // ✅ 주소 추가등록(로그인 후)
    // http://127.0.0.1:8080/api2/address/add
    // const headers = {"Authorization" : "Bearer TOKEN..."}
    /*  
    const body = 
    { 
        "address" : "서울","address_detail": "asdasd", "postno" : 34
    } 
    */
    @PostMapping("/add")
    public Map<String, Object> addAddress(
        @RequestHeader("Authorization") String token,
        @RequestBody Address addr) {
            System.out.println("AA");
            Map<String, Object> map = new HashMap<>();

        try {
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            System.out.println(token);
            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            // String userid = userInfo.get("userid").toString();
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            System.out.println(mno);
            Member member = new Member();
            member.setNo(mno);
            addr.setMember(member);

            addressRepository.save(addr);
            
            addr.setDefaultAddress(false);
            addressRepository.save(addr);

            map.put("status", 1);
            map.put("message", "주소 등록 완료");            
        } catch (Exception e) {
            map.put("status", 0);
            map.put("message", e.getMessage());
        }
        
        return map;
    }
}
