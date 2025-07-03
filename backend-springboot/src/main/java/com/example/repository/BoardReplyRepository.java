package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.Reply;

import jakarta.transaction.Transactional;

@Repository
public interface BoardReplyRepository extends JpaRepository<Reply, Long>{
  
    Reply findByNoAndMember_No(Long no, Long mno);

    @Transactional
    void deleteByNoAndMember_No(Long no, Long mno);

    List<Reply> findByBoard_NoOrderByNoAsc(Long bno);
}
