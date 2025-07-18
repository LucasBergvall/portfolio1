package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.Genre;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long>{
  
  
}
