package com.example.repository;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.entity.Like;

import jakarta.transaction.Transactional;

@Repository
public interface LikeRepository  extends JpaRepository<Like, Long>{
    
  Like findByNoAndMember_No(Long no, Long mno);

  List<Like> findByMember_No(Long mno, Pageable pageable);

  @Transactional
  void deleteByMember_NoAndItem_No(Long memberNo, Long itemNo);


  //중복검사
  boolean existsByMember_NoAndItemNo(Long memberNo, Long itemNo);

  // ✅ 핵심 쿼리 (페이징 포함)
@Query(value = """
    SELECT l.no AS likeNo,
           i.no AS itemNo,
           i.title AS title,
           ib.price AS bookprice,
           ii.no AS imageNo,
           i.discount AS discount
    FROM `like` l
    JOIN item i ON l.ino = i.no
    LEFT JOIN item_book ib ON i.no = ib.ino
    LEFT JOIN item_img ii ON i.no = ii.ino AND ii.img_default = 1
    WHERE l.mno = :mno
    """,
    countQuery = """
    SELECT count(*) 
    FROM `like` l 
    WHERE l.mno = :mno
    """,
    nativeQuery = true)
Page<Object[]> findByMemberNoNative(@Param("mno") Long mno, Pageable pageable);
}