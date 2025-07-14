package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

@Entity
@Data
@ToString(exclude = {"sender", "receiver", "paymentHistoryAction"})
@Table(name = "message_report")
public class MessageReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    // 보낸 사람
    @ManyToOne
    @JoinColumn(name = "sender_mno", referencedColumnName = "no", nullable = false)
    @JsonIgnore
    private Member sender;

    // 받는 사람
    @ManyToOne
    @JoinColumn(name = "receiver_mno", referencedColumnName = "no", nullable = false)
    @JsonIgnore
    private Member receiver;

    // 어떤 결제 및 주문 흐름에 대한 채팅인지
    @ManyToOne
    @JoinColumn(name = "pha_no", referencedColumnName = "no", nullable = false)
    @JsonIgnore
    private PaymentHistoryAction paymentHistoryAction;

    // 메시지 내용
    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    // 보낸 사람 유형: BUYER 또는 SELLER
    @Column(name = "sender_type", nullable = false)
    private String senderType;

    // 전송 시간
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @CreationTimestamp
    @Column(name = "send_time")
    private LocalDateTime sendTime;

    // 읽음 여부
    @Column(name = "seller_read", columnDefinition = "TINYINT(1)")
    private boolean sellerRead = false;

    @Column(name = "buyer_read", columnDefinition = "TINYINT(1)")
    private boolean buyerRead = false;
}
