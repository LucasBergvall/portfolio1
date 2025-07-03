package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>{
  
   @Query("SELECT ROUND(AVG(evaluation), 1) FROM Review r WHERE r.no IN :nos")
    Double findAverageEvaluationByNos(@Param("nos") List<Long> nos);
}
