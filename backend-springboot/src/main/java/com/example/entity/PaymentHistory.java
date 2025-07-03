package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "payment_history")
public class PaymentHistory {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long no;

  @Column(name = "card")
  private String card;

  @Column(name = "pay")
  private int pay;

  @Column(name = "refund")
  private int refund;

  @Column(name = "aid")
  private String aid;                 // 요청 고유 번호

  @Column(name = "tid")
  private String tid;                 // 결제 고유 번호

  @Column(name = "cid")
  private String cid;                 // 가맹점 코드

  @Column(name = "partner_order_id")
  private String partnerOrderId;    // 가맹점 주문번호

  @Column(name = "partner_user_id")
  private String partnerUserId;     // 가맹점 회원 id

  @Column(name = "payment_method_type")
  private String paymentMethodType; // 결제 수단, CARD 또는 MONEY 중 하나

  @Column(name = "item_name")
  private String itemName;           // 상품 이름

  @Column(name = "item_code")
  private String itemCode;           // 상품 코드

  @Column(name = "quantity")
  private Long quantity;               // 상품 수량

  @Column(name = "created_at")
  private String createdAt;          // 결제 준비 요청 시각

  @Column(name = "approved_at")
  private String approvedAt;         // 결제 승인 시각

  @Column(name = "payload")
  private String payload;             // 결제 승인 요청에 대해 저장한 값, 요청 시 전달된 내용

  // @OneToMany(mappedBy = "paymentHistory")
  // private List<Order> order = new ArrayList<>();
}
