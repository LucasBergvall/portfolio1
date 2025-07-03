package com.example.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.entity.Item;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    @Query("SELECT DISTINCT i FROM Item i LEFT JOIN FETCH i.itemImgList img ORDER BY i.regdate DESC")
    List<Item> findTop20WithImage();

    List<Item> findByMember_UseridOrderByRegdateDesc(String userid);

    Optional<Item> findByNo(Long no);

    List<Item> findByMember_No(Long no);

    List<Item> findByMember_No(Long no, Pageable pageable);

    List<Item> findBySaleStatusAndMember_NoAndTitleContainingOrderByRegdateDesc(int saleStatus, Long no, String title, Pageable pageable);

    @Query("SELECT i.no from Item i where i.member.no = ?1")
    List<Long> findByMno(Long no);

    // 제목이 포함된 검색기능과 등록된 날짜순 오름차순 정렬 기능, 페이지네이션 기능 추가
    List<Item> findByTitleContainingOrderByRegdateAsc(String text, Pageable pageable);

    List<Item> findBySaleStatusAndTitleContainingOrderByRegdateDesc(int saleStatus, String title, Pageable pageable);

    Item findByNoAndMember_No(Long no, Long mno);

    Long countBySaleStatusAndTitleContainingOrderByRegdateAsc(int saleStatus, String title);

 
    // 👉 기존: 판매자용
    Long countBySaleStatusAndMember_NoAndTitleContainingOrderByRegdateAsc(int saleStauts, Long mno, String text);

    Long countBySaleStatusAndMember_NoAndItemBook_Genre_NoOrderByRegdateAsc(int saleStauts, Long mno, Long gno);
                 
    List<Item> findBySaleStatusAndMember_NoAndItemBook_Genre_NoOrderByRegdateDesc(int saleStatus, Long mno, Long gno, Pageable pageable);

    // 👉 새로 추가: 구매자용
    List<Item> findBySaleStatusAndItemBook_Genre_NoOrderByRegdateDesc(int saleStatus, Long gno, Pageable pageable);
    
    Long countBySaleStatusAndItemBook_Genre_NoOrderByRegdateAsc(int saleStatus, Long gno);

    // 작가명으로 검색
    List<Item> findBySaleStatusAndItemBook_WriterContainingOrderByRegdateDesc(int saleStatus, String writer, Pageable pageable);
    Long countBySaleStatusAndItemBook_WriterContainingOrderByRegdateAsc(int saleStatus, String writer);

    // 내용으로 검색
    List<Item> findBySaleStatusAndExplainContainingOrderByRegdateDesc(int saleStatus, String explain, Pageable pageable);
    Long countBySaleStatusAndExplainContainingOrderByRegdateAsc(int saleStatus, String explain);

    // genre명으로 검색하는 메서드
    List<Item> findBySaleStatusAndItemBook_Genre_GenreNameContainingOrderByRegdateDesc(int saleStatus, String genreName, Pageable pageable);

    Long countBySaleStatusAndItemBook_Genre_GenreNameContaining(int saleStatus, String genreName);
}
  