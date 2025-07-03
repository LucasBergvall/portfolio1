package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.entity.OrderSeq;

import jakarta.transaction.Transactional;

@Repository
public interface OrderSeqRepository extends JpaRepository<OrderSeq, Long> {

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO order_seq VALUES (NULL)", nativeQuery = true)
    void insertNextSeq();

    @Query(value = "SELECT LAST_INSERT_ID()", nativeQuery = true)
    Long getLastInsertedSeq();
}

