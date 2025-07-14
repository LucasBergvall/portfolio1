package com.example.restcontroller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.entity.Board;
import com.example.entity.ImageActionBoard;
import com.example.entity.ImageActionNotice;
import com.example.entity.Member;
import com.example.entity.Notice;
import com.example.projection.ImageActionNoticeProjection;
import com.example.repository.ImageActionNoticeRepository;
import com.example.repository.NoticeRepository;
import com.example.service.NoticeServiceImpl;
import com.example.util.TokenComponent;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api2/notice")
@RequiredArgsConstructor
public class NoticeRestController {

  private final TokenComponent tComponent;
  private final NoticeServiceImpl noticeServiceImpl;
  private final NoticeRepository nRepository;
  private final ImageActionNoticeRepository ianRepository;


  // 공지사항

  // 수정
    // 127.0.0.1:8080/api2/notice/update
    // imgactionnotice는 그대로 => 연관관계니까
    // notice 에서만 변경
    // notice테이블 : title, text 변경
    /*
    {
        "no": 1,
        "title" : "수정",
        "text" : "수정2"
    }
     */
    
    @PutMapping("/update")
    public Map<String, Object> boardUpdate(
       @RequestHeader("Authorization") String token,
        @RequestPart("notice") Notice notice,
        @RequestPart(value = "img", required = false) MultipartFile[] img
    ) {
        System.out.println(notice.toString());
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
            
            map.put("status", 0);
            map.put("message", "권한이 없습니다.");

            if(admin == 1){
                Notice obj = nRepository.findByNoAndMember_No(notice.getNo(), mno);
                obj.setText(notice.getText());
                obj.setTitle(notice.getTitle());
                nRepository.save(obj);
                 // ✅ 이미지 처리 (선택사항)
                if (img != null && img.length > 0) {
                    noticeServiceImpl.modifyNoticeImages(obj.getNo(), img); 
                    // 👉 이 부분은 본인 이미지 저장 로직으로 연결하면 됩니다.
                }

                map.put("status", 1);
                map.put("message", "수정이 완료 됐습니다.");
            }
                
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }
    


    // 삭제
    // 127.0.0.1:8080/api2/notice/delete
    // headers => token , mno추출
    @DeleteMapping(value = "/delete")
    public Map<String, Object> noticeDELETE(
        @RequestHeader("Authorization") String token,
        @RequestBody Notice notice){
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
                map.put("status", 0);
                map.put("message", "권한이 없습니다.");
            if(admin == 1){
                noticeServiceImpl.deleteNotice(notice.getNo());
                map.put("status", 1);
                map.put("message", "삭제가 성공 했습니다.");
            }            
        } catch(Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }


    // 글쓰기
    // 127.0.0.1:8080/api2/notice/insert
    // post => { title, text }
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
        @RequestPart("notice") Notice obj, 
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
            int admin = Integer.parseInt(userInfo.get("admin").toString());
                map.put("status", 0);
                map.put("message", "권한이 없습니다.");
            if(admin == 1){
                // 외래키 담을 시 객체를 하나 만들고 담는다. 여기선 member객체 생성
                Member member = new Member();
                member.setNo(mno); // member 객체에 mno를 담음
                obj.setMember(member); // obj 객체에 member를 담음
                noticeServiceImpl.InsertNotice(obj, img); // noticeServiceImpl에 obj와img를 담아서 imgno를 담음
                
                map.put("status", 1);
                map.put("message", "등록이 성공 했습니다.");
            }            
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }

    // 127.0.0.1:8080/api2/notice/selectlist?page=1&cnt=20&text=
    @GetMapping("/selectlist")
    public Map<String, Object> selectList(
        @RequestParam int page,
        @RequestParam int cnt,
        @RequestParam String text ) {
       
        Map<String, Object> result = new HashMap<>();
        try {
            PageRequest pageRequest = PageRequest.of(page-1, cnt);
            List<Notice> list = nRepository.findByTitleContainingOrderByRegdateDesc(text, pageRequest);
            for(Notice obj: list) {
               ImageActionNotice tmp = ianRepository.findByNotice_NoAndImgDefault(obj.getNo(), true);
                
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
    // GET /api2/notice/select?no={no}
    @GetMapping("/select")
    public Map<String, Object> selectNotice(
        @RequestParam("no") Long no) {
        Map<String, Object> map = new HashMap<>();
        try {
            Notice notice = nRepository.findById(no).orElse(null);
            if (notice == null) {
                map.put("status", -1);
                map.put("message", "게시글이 존재하지 않습니다.");
                return map;
            }
            // ✅ 조회수 증가
            notice.setHit(notice.getHit() + 1);
            nRepository.save(notice);

            // 기본 이미지 설정
            ImageActionNotice imageActionNotice = ianRepository.findByNotice_NoAndImgDefault(no, true);
            if (imageActionNotice != null) {
                notice.setDefaultImg("/api2/img/image?no=" + imageActionNotice.getImg().getNo());
            } else {
                // 기본 이미지가 없을 때 빈 썸네일 이미지 URL로 설정
                notice.setDefaultImg("/default-thumbnail.jpg");
            }

            // 개인 정보 제거
            notice.getMember().setEmail("");
            notice.getMember().setPhone("");
            notice.getMember().setAdmin(0);
            notice.getMember().setBuyer(0);
            notice.getMember().setSeller(0);

            map.put("status", 1);
            map.put("post", notice);

            
            List<ImageActionNoticeProjection> projections = ianRepository.findByNotice_No(no);
            map.put("images", projections != null ? projections : new ArrayList<>());

        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }
    
}
