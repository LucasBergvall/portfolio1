package com.example.restcontroller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.entity.Notice;
import com.example.repository.ImageActionNoticeRepository;
import com.example.repository.NoticeRepository;
import com.example.util.TokenComponent;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api2/actionnotice")
public class ImgActionNoticeRestController {

    private final ImageActionNoticeRepository ianRepository;
    private final TokenComponent tComponent;
    private final NoticeRepository nRepository;

    @DeleteMapping("/delete")
    public Map<String, Object> imgDelete(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Long> obj) {

        Map<String, Object> map = new HashMap<>();
        try {
            // 1. 토큰 파싱
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            int admin = Integer.parseInt(userInfo.get("admin").toString());

            // 2. 전달받은 데이터 파싱
            Long nno = obj.get("nno");
            Long imno = obj.get("imno");

            // 3. Notice 엔티티 조회
            Notice notice = nRepository.findById(nno).orElse(null);
            if (notice == null) {
                map.put("status", -1);
                map.put("message", "공지사항이 존재하지 않습니다.");
                return map;
            }

            // 4. 권한 확인
            if (!notice.getMember().getNo().equals(mno)) {
                map.put("status", 0);
                map.put("message", "본인의 글이 아닙니다.");
                return map;
            }

            if (admin != 1) {
                map.put("status", 0);
                map.put("message", "관리자만 삭제할 수 있습니다.");
                return map;
            }

            // 5. 삭제 수행
            ianRepository.deleteByNotice_NoAndImg_No(nno, imno);
            map.put("status", 1);
            map.put("message", "이미지 삭제 성공");

        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }

        return map;
    }
}
