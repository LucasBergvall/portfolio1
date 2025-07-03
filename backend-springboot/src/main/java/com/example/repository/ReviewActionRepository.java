package com.example.repository;


import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.dto.ReviewListDTO;
import com.example.entity.ReviewAction;

import jakarta.transaction.Transactional;

@Repository
public interface ReviewActionRepository extends JpaRepository<ReviewAction, Long>{
  
  @Modifying
  @Transactional
  void deleteByReview_NoAndMember_No(Long no, Long mno);

  boolean existsByReview_NoAndMember_No(Long no, Long mno);

  ReviewAction findByPaymentHistoryAction_No(Long phano);

  List<ReviewAction> findByMember_No(Long mno);

  boolean existsByPaymentHistoryAction_NoAndMember_No(Long phano, Long mno);

  // ✅ 최종 완성본 (정상 작동)
@Query("""
  SELECT new com.example.dto.ReviewListDTO(
      r.no, r.review, r.evaluation, r.regdate, 
      ph.pay, o.quantity, ib.bookprice, ib.defaultImg
  )
  FROM ReviewAction ra
  JOIN ra.review r
  JOIN ra.paymentHistoryAction pha
  JOIN pha.paymentHistory ph
  JOIN pha.order o
  JOIN o.item i
  JOIN ItemBook ib ON ib.item = i
  JOIN o.member m
  WHERE m.no = :mno
  """)
  Page<ReviewListDTO> findMyReviewsWithItem(@Param("mno") Long mno, Pageable pageable);

  @Query("SELECT ra.paymentHistoryAction.order.no FROM ReviewAction ra WHERE ra.member.no = :mno AND ra.review.no IS NOT NULL")
  List<Long> findOrderNosWithReviewByMember(@Param("mno") Long mno);

}
