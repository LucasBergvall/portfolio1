package com.example.repository;

import com.example.entity.ImageActionBoard;
import com.example.entity.Board;
import com.example.entity.Img;
import com.example.projection.ImageActionBoardProjection;

import jakarta.transaction.Transactional;

import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageActionBoardRepository extends JpaRepository<ImageActionBoard, Long> {

    // 🔍 게시글로 조회
    List<ImageActionBoard> findByBoard(Board board);

    // 🔍 이미지로 조회
    List<ImageActionBoard> findByImg(Img img);

    // ❌ 게시글 번호로 삭제
    void deleteByBoard(Board board);

    // ❌ 이미지 번호로 삭제
    void deleteByImg(Img img);

    // 게시판번호 + 대표이미지 true / false 설정
    Long countByBoard_NoAndImgDefault(Long bno, boolean img_default);

    ImageActionBoard findByBoard_NoAndImgDefault(Long bno, Boolean imgDefault);

    // 2. 프로젝션으로 필요한 필드만 조회 (리스트 출력 등 조회 전용)
    List<ImageActionBoardProjection> findByBoard_No(Long no);

    List<ImageActionBoard> findAllByBoard_No(Long no);

    @Transactional
    void deleteByBoard_No(Long bno);

    @Transactional
    void deleteByBoard_NoAndImg_No(Long bno, Long imno);

    @Query("SELECT i FROM ImageActionBoard i WHERE i.board.no = :boardNo")
    List<ImageActionBoard> findByBoard_NoEntity(@Param("boardNo") Long boardNo);

}
