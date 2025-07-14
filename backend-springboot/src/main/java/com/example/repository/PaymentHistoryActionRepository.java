package com.example.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.PaymentHistoryAction;

@Repository
public interface PaymentHistoryActionRepository extends JpaRepository<PaymentHistoryAction, Long> {
  List<PaymentHistoryAction> findByPaymentHistory_NoAndOrder_No(Long phno, Long ono);
  
  Optional<PaymentHistoryAction> findByOrder_No(Long orderNo);


}
