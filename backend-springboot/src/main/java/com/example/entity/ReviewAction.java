package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "review_action")
public class ReviewAction {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long no;

  @ManyToOne
  @JoinColumn(name = "mno", referencedColumnName = "no")
  private Member member;

  @ManyToOne
  @JoinColumn(name = "rno", referencedColumnName = "no")
  private Review review;

  @OneToOne
  @JoinColumn(name = "phano", referencedColumnName = "no")
  private PaymentHistoryAction paymentHistoryAction;

  
}
