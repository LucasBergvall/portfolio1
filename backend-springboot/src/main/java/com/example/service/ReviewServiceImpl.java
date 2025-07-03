package com.example.service;

import org.springframework.stereotype.Service;

import com.example.entity.Review;
import com.example.entity.ReviewAction;
import com.example.repository.ReviewActionRepository;
import com.example.repository.ReviewRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl {

  private final ReviewRepository reviewRepository;
  private final ReviewActionRepository reviewActionRepository;
  
  public void insertReview(Review review, ReviewAction reviewAction) {
    Review obj = reviewRepository.save(review);
    reviewAction.setReview(obj);
    reviewActionRepository.save(reviewAction);
  }

  public void deleteReview(Long no, Long mno) {
    try {
        if (reviewActionRepository.existsByReview_NoAndMember_No(no, mno)) {
            reviewActionRepository.deleteByReview_NoAndMember_No(no, mno);
            reviewRepository.deleteById(no);
        }
    } catch (Exception e) {
        e.printStackTrace(); // 로그 출력
    }
  }
}
