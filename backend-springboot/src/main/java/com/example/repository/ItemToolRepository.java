package com.example.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.ItemTool;


@Repository
public interface ItemToolRepository extends JpaRepository<ItemTool, Long> {
  
    Optional<ItemTool> findByItem_No(Long no);
}
