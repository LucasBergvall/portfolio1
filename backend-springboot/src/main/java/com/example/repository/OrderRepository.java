package com.example.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.entity.Order;


@Repository
public interface OrderRepository extends JpaRepository<Order, Long>{

  @Query(value = "SELECT LAST_INSERT_ID()", nativeQuery = true)
  Long getLastInsertedSeq();

  List<Order> findByMember_No(Long no, Pageable pageable);

  List<Order> findByItem_Member_No(Long mno, Pageable pageable);

  // 결제 번호를 통해 주문 목록을 조회
  // List<Order> findByPaymentHistory_No(Long phno);
}
