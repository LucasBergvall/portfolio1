package com.example.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.entity.Cart;
import com.example.projection.CartGroupProjection;

import jakarta.transaction.Transactional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long>{
  Cart findByNoAndMember_No(Long no, Long mno);

  // List<Cart> findByMember_No(Long mno, Pageable pageable);

  Page<Cart> findByMember_No(Long mno, Pageable pageable);

  boolean existsByMember_NoAndItem_No(Long mno, Long ino);

  Optional<Cart> findByMember_NoAndItem_No(Long mno, Long ino);

  List<Cart> findByNoIn(List<Long> list);

  @Transactional
  void deleteByNoAndMember_No(Long no, Long mno);

  @Transactional
  void deleteByNoIn(List<Long> list);

  @Query("""
    SELECT 
        c.no AS cartNo, 
        i.no AS itemNo, 
        i.title AS title,
        c.quantity AS quantity,
        b.bookprice AS bookprice, 
        i.discount AS discount, 
        m.nickname AS sellerNickname, 
        b.defaultImg AS imgDefault
    FROM Cart c
    JOIN c.item i
    JOIN i.itemBook b
    JOIN i.member m
    WHERE c.member.no = :mno
    ORDER BY m.nickname
  """)
  Page<CartGroupProjection> findGroupedBySeller(
      @Param("mno") Long mno, Pageable pageable);

}
