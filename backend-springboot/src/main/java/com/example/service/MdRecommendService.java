package com.example.service;

import java.util.List;
import java.util.Map;

public interface MdRecommendService {
    List<Map<String, Object>> getRecommendBookList(String groupName);
    Map<String, Object> getRecommendBookOne(Long recommendId);
    void insertRecommendBook(String groupName, Long itemNo, int sortOrder);
    void updateSortOrder(Long recommendId, int sortOrder);
}
