package com.example.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.entity.Board;
import com.example.entity.Notice;
import java.util.List;


public interface NoticeRepository extends JpaRepository<Notice, Long>{

  // 제목과 정확히 일치하는 경우 조회
  List<Notice> findByTitle(String title);

  // 특정 문자열이 포함된 제목으로 조회
  List<Notice> findByTitleContaining(String title);

  // 페이징 전체 조회
  List<Notice> findAllBy(Pageable pageable);

  // ✔ 게시글 저장 및 수정 → save(entity) 로 처리 (별도 메서드 필요 없음)

  Long countByNoAndMember_No(Long no, Long mno);

  Notice findByNoAndMember_No(Long no, Long mno);

  boolean existsByNoAndMember_No(Long no, Long mno);

  boolean existsByNoAndMember_Admin(Long no, int admin);

  List<Notice> findByTitleContainingOrderByRegdateDesc(String text, Pageable pageable);
}
