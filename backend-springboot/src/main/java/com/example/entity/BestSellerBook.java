package com.example.entity;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "best_seller_book")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BestSellerBook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "ibno", referencedColumnName = "ino")
    private ItemBook itemBook;

    @Column(nullable = false)
    private Integer rank;

    @CreationTimestamp
    private LocalDateTime regdate;

    @Column(nullable = false)
    private Boolean visible = true;

    private String note;
}

