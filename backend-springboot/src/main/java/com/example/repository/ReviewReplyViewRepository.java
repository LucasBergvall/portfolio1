// package com.example.repository;

// import java.util.List;

// import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.stereotype.Repository;

// import com.example.entity.view.ReviewReplyView;

// @Repository
// public interface ReviewReplyViewRepository extends JpaRepository<ReviewReplyView, Long>{
//   Boolean existsByMnoAndNo(Long mno, Long no);

//   @Query("SELECT rrv.no from ReviewReplyView rrv where rrv.mno = ?1")
//   List<Long> findByMno(Long no);
// }
