package com.example.restcontroller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


import com.example.entity.Board;
import com.example.entity.ImageActionBoard;
import com.example.entity.Member;
import com.example.projection.ImageActionBoardProjection;
import com.example.repository.BoardRepository;
import com.example.repository.ImageActionBoardRepository;
import com.example.repository.ImgRepository;
import com.example.service.BoardServiceImpl;
import com.example.util.TokenComponent;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping("/api2/board")
@RequiredArgsConstructor
public class BoardRestController {

    private final BoardServiceImpl boardServiceImpl;
    private final TokenComponent tComponent;
    private final BoardRepository bRepository;
    private final ImageActionBoardRepository ibaRepository;
    private final ImgRepository imgRepository;

    // 수정
    // 127.0.0.1:8080/api2/board/update
    // imgactionboard는 그대로 => 연관관계니까
    // board 에서만 변경
    // board테이블 : title, text 변경
    
    @PutMapping(value = "/update", consumes = "multipart/form-data")
    public Map<String, Object> boardUpdate(
        @RequestHeader("Authorization") String token,
        @RequestPart("board") Board board, 
        @RequestPart(value = "img", required = false) MultipartFile[] imgs  // ✅ 이미지들
    ) {
         Map<String, Object> map = new HashMap<>();
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());

            Board obj = bRepository.findByNoAndMember_No(board.getNo(), mno);
            obj.setText(board.getText());
            obj.setTitle(board.getTitle());
            bRepository.save(obj);

            if (imgs != null && imgs.length > 0) {
                boardServiceImpl.modifyBoardImages(board.getNo(), imgs);
            }

            map.put("status", 1);
            map.put("message", "수정이 완료 됐습니다.");
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }
    


    // 삭제
    // 127.0.0.1:8080/api2/board/delete
    // headers => token , mno추출
    @DeleteMapping(value = "/delete")
    public Map<String, Object> boardDELETE(
        @RequestHeader("Authorization") String token,
        @RequestBody Board board){
        System.out.println(board.getNo());
        Map<String, Object> map = new HashMap<>();
        try {
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            int admin = Integer.parseInt(userInfo.get("admin").toString());
            
            if(admin == 1){
                boardServiceImpl.deleteBoardAdmin(board.getNo());
            } else {
               Long no = bRepository.countByNoAndMember_No(board.getNo(), mno);
               if(no > 0){
                boardServiceImpl.deleteBoard(board.getNo(), mno);
               }
            }
            map.put("status", 1);
            map.put("message", "삭제가 성공 했습니다.");
        } catch(Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }


    // 글쓰기
    // 127.0.0.1:8080/api2/board/insert
    // post => { title, content, writer }
    /* 
    {
        "title": "게시글 테스트 제목",
        "text": "이것은 게시글의 본문 내용입니다."
    }
    */
    // obj에는 title, text, mno에 회원 번호를 담아야 됨
    // mno = 외래키 => 외래키를 담을 시 객체를 하나 만들어서 담아야 한다. 여기선 member객체를 생성 하였다.
    // 이미지, 게시판 글을 함께 담음
    @PostMapping(value = "/insert")
    public Map<String, Object> insertPOST(
        @RequestHeader("Authorization") String token,    
        @RequestPart("board") Board obj,
        @RequestPart("img")  MultipartFile[] img) {
        Map<String, Object> map = new HashMap<>();
         try {
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            // 외래키 담을 시 객체를 하나 만들고 담는다. 여기선 member객체 생성
            Member member = new Member();
            member.setNo(mno); // member 객체에 mno를 담음
            obj.setMember(member); // obj 객체에 member를 담음
            System.out.println(obj.toString());
            boardServiceImpl.InsertBoard(obj, img); // boardServiceImpl에 obj와img를 담아서 imgno를 담음
            
            map.put("status", 1);
            map.put("message", "등록이 성공 했습니다.");
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }

    // 127.0.0.1:8080/api2/board/selectlist?page=1&cnt=20&text=
    @GetMapping("/selectlist")
    public Map<String, Object> selectList(
        @RequestParam int page,
        @RequestParam int cnt,
        @RequestParam String text ) {
       
        Map<String, Object> result = new HashMap<>();
        try {
            PageRequest pageRequest = PageRequest.of(page-1, cnt);
            List<Board> list = bRepository.findByTitleContainingOrderByRegdateDesc(text, pageRequest);
            for(Board obj: list) {
               ImageActionBoard tmp = ibaRepository.findByBoard_NoAndImgDefault(obj.getNo(), true);
                
               obj.setDefaultImg("/api2/img/image?no=0");
               if (tmp != null) {
                    obj.setDefaultImg("/api2/img/image?no=" + tmp.getImg().getNo());
               }
               obj.getMember().setEmail(" ");
               obj.getMember().setPhone(" ");
               obj.getMember().setAdmin(0);
               obj.getMember().setSeller(0);
               obj.getMember().setBuyer(0);
               obj.getMember().setAvg_evaluation(0);
               obj.getMember().setCancel_enable(0);
            }
            result.put("status", 1);
            result.put("list", list);
        } catch (Exception e) {
            result.put("status", -1);
            result.put("message", e.getMessage());
        }
        return result;
    
    }


    // 게시글 단건 조회
    // GET /api2/board/select?no={no}
    @GetMapping("/select")
    public Map<String, Object> readBoard(
        @RequestParam("no") Long no) {
        Map<String, Object> map = new HashMap<>();
        try {
            Board board = bRepository.findById(no).orElse(null);
            if (board == null) {
                map.put("status", -1);
                map.put("message", "게시글이 존재하지 않습니다.");
                return map;
            }

            // ✅ 조회수 증가
            board.setHit(board.getHit() + 1);
            bRepository.save(board);

            // 기본 이미지 설정
            ImageActionBoard imageActionBoard = ibaRepository.findByBoard_NoAndImgDefault(no, true);
            if (imageActionBoard != null) {
                board.setDefaultImg("/api2/img/image?no=" + imageActionBoard.getImg().getNo());
            } else {
                board.setDefaultImg("/default-thumbnail.jpg");
            }

            // 개인 정보 제거
            board.getMember().setEmail("");
            board.getMember().setPhone("");
            board.getMember().setAdmin(0);
            board.getMember().setBuyer(0);
            board.getMember().setSeller(0);

            map.put("status", 1);
            map.put("post", board);

            List<ImageActionBoardProjection> projections = ibaRepository.findByBoard_No(no);
            map.put("images", projections != null ? projections : new ArrayList<>());
            
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }
    
}
