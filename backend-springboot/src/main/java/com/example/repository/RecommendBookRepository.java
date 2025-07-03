package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.RecommendBook;
import com.example.entity.RecommendGroup;

@Repository
public interface RecommendBookRepository extends JpaRepository<RecommendBook, Long> {
    // 그룹별 책 목록 조회
    List<RecommendBook> findByGroupOrderBySortOrderAsc(RecommendGroup group);
}
