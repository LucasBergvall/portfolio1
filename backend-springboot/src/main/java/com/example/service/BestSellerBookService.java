package com.example.service;

import java.util.List;
import java.util.Map;

public interface BestSellerBookService {
    // 🔽 베스트셀러 물품 등록
    void insertBestSeller(Long ino, Integer rank, String note);

     // 🔽 베스트셀러 llist목록 조회
    List<Map<String, Object>> getBestSellerList();

      // 🔽 베스트셀러 1개목록 조회
    Map<String, Object> getBestSellerOne(Long no);
}