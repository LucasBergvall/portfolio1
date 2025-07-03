package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.RecommendGroup;

@Repository
public interface RecommendGroupRepository extends JpaRepository<RecommendGroup, Long> {
    RecommendGroup findByGroupName(String groupName);
    
}
