package com.example.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "order_seq")
@Getter
@NoArgsConstructor
@ToString
public class OrderSeq {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 별다른 필드 필요 없음 (id만 사용)
}
