package com.example.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.entity.Board;
import com.example.entity.ImageActionBoard;
import com.example.entity.Img;
import com.example.repository.BoardRepository;
import com.example.repository.ImageActionBoardRepository;
import com.example.repository.ImgRepository;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl {

  private final ImageActionBoardRepository imageActionBoardRepository;
  private final BoardRepository bRepository;
  private final ImgRepository imgRepository;

  // 관리자가 아닐때
  @Transactional
  public void deleteBoard(Long boardNo, Long mno) {
    Board board = bRepository.findByNoAndMember_No(boardNo, mno);
    if (board == null) {
        throw new RuntimeException("해당 게시글이 존재하지 않거나 권한이 없습니다.");
    }

    // imageActionBoard 조회
    List<ImageActionBoard> iabList = imageActionBoardRepository.findByBoard_NoEntity(boardNo);

    // Img 삭제 전에 관계 끊기
    for (ImageActionBoard iab : iabList) {
        iab.setImg(null);   // ⭐ 관계 끊기
        iab.setBoard(null); // (선택적) 보드도 끊기
    }

    // 1. ImageActionBoard 삭제
    imageActionBoardRepository.deleteAll(iabList);

    // 2. Img 삭제
    for (ImageActionBoard iab : iabList) {
        if (iab.getImg() != null) {
            imgRepository.deleteById(iab.getImg().getNo());
        }
    }

    // 3. 게시글 삭제
    bRepository.delete(board);
  }

  // 관리자일때
 @Transactional
  public void deleteBoardAdmin(Long boardNo) {
     // 1. 게시글 조회
    Board board = bRepository.findById(boardNo)
        .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));

    // 2. imageActionBoard 객체 조회
    List<ImageActionBoard> iabList = imageActionBoardRepository.findByBoard_NoEntity(boardNo);

    // 3. 관계 끊기
    for (ImageActionBoard iab : iabList) {
        iab.setImg(null);
        iab.setBoard(null);
    }

    // 4. imageActionBoard 삭제
    imageActionBoardRepository.deleteAll(iabList);

    // 5. Img 삭제
    for (ImageActionBoard iab : iabList) {
        if (iab.getImg() != null) {
            imgRepository.deleteById(iab.getImg().getNo());
        }
    }

    // 6. 게시글 삭제
    bRepository.delete(board);
  }

  @Transactional
  public void InsertBoard(Board board, MultipartFile[] imgs) throws IOException {
    Board board1 = bRepository.save(board);
    
    int idx = 0;
    for(MultipartFile img : imgs) {
      if(!img.isEmpty()) {
        Img img2 = new Img();
        img2.setData(img.getBytes());
        img2.setName(img.getOriginalFilename());
        img2.setType(img.getContentType());
        img2.setSize(img.getSize());
            
        Img img3 = imgRepository.save(img2);

        ImageActionBoard imageActionBoard = new ImageActionBoard();

        imageActionBoard.setBoard(board1);
        imageActionBoard.setImg(img3);
        if (idx == 0) {
          imageActionBoard.setImgDefault(true);
        }
        else {
          imageActionBoard.setImgDefault(false);
        } 
        idx++;
        imageActionBoardRepository.save(imageActionBoard);
      }
    }
  }

  public void modifyBoardImages(Long boardNo, MultipartFile[] imgs) throws IOException {
    Board board = bRepository.findById(boardNo).orElseThrow(() -> new IllegalArgumentException("게시글 없음"));

    boolean hasDefault = imageActionBoardRepository.countByBoard_NoAndImgDefault(boardNo, true) > 0;

    for (int i = 0; i < imgs.length; i++) {
        MultipartFile img = imgs[i];

      if (!img.isEmpty()) {
          Img img2 = new Img();
          img2.setData(img.getBytes());
          img2.setName(img.getOriginalFilename());
          img2.setType(img.getContentType());
          img2.setSize(img.getSize());
          // 저장 시 비어있던 이미지번호, 날짜 등이 다 채워진 상태로 반환
          Img savedImg = imgRepository.save(img2);

          ImageActionBoard imageActionBoard = new ImageActionBoard();
          imageActionBoard.setBoard(board);
          imageActionBoard.setImg(savedImg);


          // ✅ 대표 이미지 설정: 기존에 없을 경우 첫 번째만 true
            imageActionBoard.setImgDefault(!hasDefault && i == 0);

            if (!hasDefault && i == 0) {
                hasDefault = true; // 최초 1장만 대표로
            }

            imageActionBoardRepository.save(imageActionBoard);
        }
    }
  }


  // @Transactional
  // public void modifyBoardImages(Long boardNo, MultipartFile[] imgs) throws IOException {
  //     // 기존 이미지들 제거
  //     List<ImageActionBoardProjection> existingImages = imageActionBoardRepository.findByBoard_No(boardNo);
  //     imageActionBoardRepository.deleteByBoard_No(boardNo);
  //     for (ImageActionBoardProjection image : existingImages) {
  //         imgRepository.deleteById(image.getImg().getNo());
  //     }

  //     // 새 이미지들 저장
  //     Board board = bRepository.findById(boardNo).orElseThrow(() -> new IllegalArgumentException("게시글 없음"));
  //     int idx = 0;
  //     for (MultipartFile img : imgs) {
  //         if (!img.isEmpty()) {
  //             Img img2 = new Img();
  //             img2.setData(img.getBytes());
  //             img2.setName(img.getOriginalFilename());
  //             img2.setType(img.getContentType());
  //             img2.setSize(img.getSize());

  //             Img savedImg = imgRepository.save(img2);

  //             ImageActionBoard imageActionBoard = new ImageActionBoard();
  //             imageActionBoard.setBoard(board);
  //             imageActionBoard.setImg(savedImg);
  //             imageActionBoard.setImgDefault(idx == 0);
  //             imageActionBoardRepository.save(imageActionBoard);

  //             idx++;
  //         }
  //     }
  // }
}
