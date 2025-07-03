package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.BestSellerBook;


@Repository
public interface BestSellerBookRepository extends JpaRepository<BestSellerBook, Long>{
 // 쿼리 없이 순수 메서드 이름으로 처리
    List<BestSellerBook> findTop10ByVisibleTrueOrderByRankAsc();
   
}
