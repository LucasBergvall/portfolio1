package com.example.entity;



import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;


@Entity
@Table(name = "recommend_book")
@Data
public class RecommendBook {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private RecommendGroup group;

    @ManyToOne
    @JoinColumn(name = "no")
    private Item item;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @CreationTimestamp
    private Date regDate;
}

