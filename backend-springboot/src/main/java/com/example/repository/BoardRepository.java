package com.example.repository;

import com.example.dto.BoardDTO;
import com.example.entity.Board;
import com.example.entity.Item;
import com.example.projection.ItemImgProjection;

import jakarta.transaction.Transactional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {

    // 제목으로 게시판 조회
    List<Board> findByTitle(String title);

    // 특정 문자열로 게시판 조회
    List<Board> findByTitleContaining(String title);

    // 페이징 전체 조회
    List<Board> findAllBy(Pageable pageable);

    // ✔ 게시글 저장 및 수정 → save(entity) 로 처리 (별도 메서드 필요 없음)

    List<Board> findByTitleContainingOrderByRegdateDesc(String text, Pageable pageable);

    Long countByNoAndMember_No(Long no, Long mno);

    @Transactional
    void deleteByNoAndMember_No(Long no, Long mno);    

    Board findByNoAndMember_No(Long no, Long mno);

    boolean existsByNoAndMember_No(Long no, Long mno);

     
}
