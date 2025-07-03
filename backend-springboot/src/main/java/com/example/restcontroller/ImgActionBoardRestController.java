package com.example.restcontroller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.entity.Board;
import com.example.entity.ImageActionBoard;
import com.example.entity.Img;
import com.example.repository.BoardRepository;
import com.example.repository.ImageActionBoardRepository;
import com.example.repository.ImgRepository;
import com.example.util.TokenComponent;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api2/actionboard")
public class ImgActionBoardRestController {

  private final ImageActionBoardRepository iabRepository;
  private final TokenComponent tComponent;
  private final BoardRepository bRepository;
  private final ImgRepository imgRepository;


  // 127.0.0.1:8080/api2/actionboard/delete
  // header token, bno, imno
  /*  {
        "bno" : 15,
        "imno" : 16
      }
  */ 

  /*
  트리거
  image_action_board에서 bno를 조회 후 imno를 삭제 시 
  imno로 연결된 img테이블에 이미지 삭제를 쿼리문에 트리거로 구현

  DELIMITER //

  CREATE TRIGGER trg_delete_image_action_board
  AFTER DELETE ON image_action_board
  FOR EACH ROW
  BEGIN
      DELETE FROM img WHERE no = OLD.imno;
  END;
  //

  DELIMITER ; 
  */
  @Transactional
  @DeleteMapping("/delete") 
        public Map<String, Object> imgDelete(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Long> obj
    ){
        System.out.println(token);
        Map<String, Object> map = new HashMap<>();
        try {
           if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            // 본인 것인지 확인
            Long bno = obj.get("bno");
            Long imno = obj.get("imno");
            map.put("status", 0);
            map.put("message", "삭제 할 수 없습니다.");
            if(bRepository.existsByNoAndMember_No(bno, mno)) {
                iabRepository.deleteByBoard_NoAndImg_No(bno, imno);

                // 삭제 후 대표 이미지가 남아 있는지 확인
                Long cnt = iabRepository.countByBoard_NoAndImgDefault(bno, true);
                if (cnt == 0) {
                    List<ImageActionBoard> list = iabRepository.findAllByBoard_No(bno);
                    if (!list.isEmpty()) {
                        ImageActionBoard first = list.get(0);
                        first.setImgDefault(true);
                        iabRepository.save(first);
                        System.out.println("대표 이미지가 없어 재지정됨: " + first.getImg().getNo());
                    }
                }
              map.put("status", 1);
              map.put("message", "삭제가 성공 했습니다.");
            }   else {
                map.put("status", 0);
                map.put("message", "삭제 권한이 없습니다.");
            }
            
        } catch(Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }

    public void modifyBoardImages(Long boardNo, MultipartFile[] imgs) {
        Board board = bRepository.findById(boardNo)
            .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        boolean hasDefault = iabRepository.countByBoard_NoAndImgDefault(boardNo, true) > 0;

        for (int i = 0; i < imgs.length; i++) {
            MultipartFile file = imgs[i];

             // 🔐 파일이 비어있는지 체크
        if (file.isEmpty()) continue;

        try {
            // 1. 이미지 저장 (saveImg 메서드 직접 구현)
            Img img = new Img();
            img.setData(file.getBytes());
            img.setName(file.getOriginalFilename());
            img.setType(file.getContentType());
            img.setSize(file.getSize());

            Img savedImg = imgRepository.save(img); // DB 저장

            // 2. 액션 등록
            ImageActionBoard iab = new ImageActionBoard();
            iab.setBoard(board);
            iab.setImg(savedImg);

            // 3. 대표 이미지 지정
            boolean isDefault = !hasDefault && i == 0;
            iab.setImgDefault(isDefault);
            iabRepository.save(iab);

            if (isDefault) {
                hasDefault = true; // 최초 1장만 true
                System.out.println("대표 이미지로 지정됨: " + savedImg.getNo());
            }
        } catch (Exception e) {
            System.err.println("이미지 저장 실패: " + e.getMessage());
            throw new RuntimeException("이미지 업로드 실패");
        }
    }
}
    
}
