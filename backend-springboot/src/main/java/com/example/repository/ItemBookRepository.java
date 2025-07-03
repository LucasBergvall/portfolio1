package com.example.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.ItemBook;

@Repository
public interface ItemBookRepository extends JpaRepository<ItemBook, Long>{

   Optional<ItemBook> findByItem_No(Long no);
}
