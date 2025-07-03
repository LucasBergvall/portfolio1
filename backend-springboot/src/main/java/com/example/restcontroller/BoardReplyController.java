package com.example.restcontroller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import com.example.entity.Member;
import com.example.entity.Reply;
import com.example.repository.BoardReplyRepository;
import com.example.util.TokenComponent;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;


@RestController
@RequestMapping("/api2/breply")
@RequiredArgsConstructor
public class BoardReplyController {

  private final BoardReplyRepository boardReplyRepository;

  private final TokenComponent tComponent;

  // 127.0.0.1:8080/api2/breply/insert
  //headers : token
  /*
  {
    "board" : { "no" : 13 },
    "rtext" : "답글"
  }
  */
  @PostMapping(value = "/insert")
    public Map<String, Object> insertPOST(
        @RequestHeader("Authorization") String token,    
        @RequestBody Reply reply) {
        Map<String, Object> map = new HashMap<>();
         try {
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            Member member = new Member();
            member.setNo(mno);
            reply.setMember(member);
            System.out.println(reply.toString());
            boardReplyRepository.save(reply);
            map.put("status", 1);
            map.put("message", "등록이 성공 했습니다.");
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }
  
  // 127.0.0.1:8080/api2/breply/update
  // headers : token
  /*
  {
    "no" : 1,
    "rtext" : ""
  }
  */

  @PutMapping("/update")
    public Map<String, Object> boardUpdate(
        @RequestHeader("Authorization") String token,
        @RequestBody Reply obj
    ) {
        Map<String, Object> map = new HashMap<>();
        try {
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            Reply reply = boardReplyRepository.findByNoAndMember_No(obj.getNo(), mno);

            map.put("status", 0);
            map.put("message", "댓글 정보 없음");
            if(reply != null) {
              reply.setRtext(obj.getRtext());
              boardReplyRepository.save(reply);
              map.put("status", 1);
              map.put("message", "수정이 완료 됐습니다.");
            }
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }

    // 127.0.0.1:8080/api2/breply/delete
    // headers : token
    /*
    {
      "no" : 1
    }
    */

    @DeleteMapping(value = "/delete")
    public Map<String, Object> boardDELETE(
        @RequestHeader("Authorization") String token,
        @RequestBody Reply obj){
        Map<String, Object> map = new HashMap<>();
        try {
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            boardReplyRepository.deleteByNoAndMember_No(obj.getNo(), mno);
            map.put("status", 1);
            map.put("message", "삭제가 성공 했습니다.");
        } catch(Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }

    // 127.0.0.1:8080/api2/breply/list?bno=13
    @GetMapping("/list")
    public Map<String, Object> replyList(@RequestParam("bno") Long bno) {
        Map<String, Object> map = new HashMap<>();
        try {
            // 댓글 리스트 조회 (Board.no 기준)
            List<Reply> list = boardReplyRepository.findByBoard_NoOrderByNoAsc(bno);

            // 개인정보 가림 처리 (선택적)
            for (Reply r : list) {
                if (r.getMember() != null) {
                    r.getMember().setPhone("");
                    r.getMember().setEmail("");
                    r.getMember().setPassword("");
                }
            }

            map.put("status", 1);
            map.put("list", list);
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }
}
