package com.example.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.entity.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {



    List<Event> findByMember_UseridOrderByRegdateDesc(String userid);

    Optional<Event> findByNo(Long no);

    List<Event> findByMember_No(Long no);

    List<Event> findByMember_No(Long no, Pageable pageable);

    @Query("SELECT i.no from Event i where i.member.no = ?1")
    List<Long> findByMno(Long no);

    // 제목이 포함된 검색기능과 등록된 날짜순 오름차순 정렬 기능, 페이지네이션 기능 추가
    List<Event> findByTitleContainingOrderByRegdateAsc(String text, Pageable pageable);


    @Query("SELECT COUNT(e) > 0 FROM Event e WHERE e.item.no = :itemNo AND e.member.no = :memberNo")
    boolean existsByItemNoAndMemberNo(@Param("itemNo") Long itemNo, @Param("memberNo") Long memberNo);


    

    void deleteByNo(Long no);

    @Query("SELECT COUNT(e) > 0 FROM Event e WHERE e.no = :eventNo AND e.member.no = :memberNo")
    boolean existsByNoAndMemberNo(@Param("eventNo") Long eventNo, @Param("memberNo") Long memberNo);

    List<Event> findAllByOrderByRegdateAsc(Pageable pageable);

}
  