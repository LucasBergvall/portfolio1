package com.example.entity;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "payment_history_action")
public class PaymentHistoryAction {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long no;

  @CreationTimestamp
  @Column(name = "regdate")
  private Date regdate;

  @ManyToOne
  @JoinColumn(name = "phno" ,referencedColumnName = "no")
  private PaymentHistory paymentHistory;

  @ManyToOne
  @JoinColumn(name = "ono" ,referencedColumnName = "no")
  private Order order;

}
