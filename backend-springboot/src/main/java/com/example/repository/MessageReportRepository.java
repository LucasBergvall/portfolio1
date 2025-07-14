package com.example.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.entity.MessageReport;

import jakarta.transaction.Transactional;

@Repository
public interface MessageReportRepository extends JpaRepository<MessageReport, Long> {
    List<MessageReport> findByPaymentHistoryAction_NoOrderBySendTimeAsc(Long phaNo);

    List<MessageReport> findByPaymentHistoryAction_Order_NoOrderBySendTimeDesc(Long orderNo, Pageable pageable);

    @Query("SELECT m FROM MessageReport m WHERE m.no = :no AND (m.sender.no = :mno OR m.receiver.no = :mno)")
    Optional<MessageReport> findMessageForUser(@Param("no") Long no, @Param("mno") Long mno);

    @Transactional
    @Modifying
    @Query("UPDATE MessageReport m " +
            "SET m.sellerRead = true " +
            "WHERE m.paymentHistoryAction.no = :phano " +
            "AND (m.sender.no = :mno OR m.receiver.no = :mno)")
    int updateSellerRead(@Param("phano") Long phano, @Param("mno") Long mno);

    @Transactional
    @Modifying
    @Query("UPDATE MessageReport m " +
            "SET m.buyerRead = true " +
            "WHERE m.paymentHistoryAction.no = :phano " +
            "AND (m.sender.no = :mno OR m.receiver.no = :mno)")
    int updateBuyerRead(@Param("phano") Long phano, @Param("mno") Long mno);

    @Query("SELECT COUNT(m) FROM MessageReport m " +
            "WHERE m.paymentHistoryAction.no = :phano " +
            "AND (m.sender.no = :mno OR m.receiver.no = :mno) " +
            "AND m.sellerRead = false")
    long countUnreadSellerMessages(@Param("phano") Long phano, @Param("mno") Long mno);

    @Query("SELECT COUNT(m) FROM MessageReport m " +
            "WHERE m.paymentHistoryAction.no = :phano " +
            "AND (m.sender.no = :mno OR m.receiver.no = :mno) " +
            "AND m.buyerRead = false")
    long countUnreadBuyerMessages(@Param("phano") Long phano, @Param("mno") Long mno);

    @Modifying
    @Transactional
    @Query("UPDATE MessageReport m SET m.sellerRead = true WHERE m.no = :no")
    int updateSellerReadByNo(Long no);

    @Modifying
    @Transactional
    @Query("UPDATE MessageReport m SET m.buyerRead = true WHERE m.no = :no")
    int updateBuyerReadByNo(Long no);
}
