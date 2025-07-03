package com.example.service;

import java.util.List;
import java.util.Map;

public interface PublisherRecommendService {
    // 그룹 전체 조회
    List<Map<String, Object>> getRecommendBookList(String groupName);

    // 상세 1개 조회
    Map<String, Object> getRecommendBookOne(Long recommendId);

    // 기존 insert/update 그대로 유지
    void insertRecommendBook(String groupName, Long itemNo, int sortOrder);
    void updateSortOrder(Long recommendId, int sortOrder);
}
