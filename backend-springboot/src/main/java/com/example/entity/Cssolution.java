package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Entity
@Data
@Table(name = "cssolution")
public class Cssolution {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long no;

  @Column(name = "title")
  private String title;

  @Column(name = "text")
  private String text;

  @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  @CreationTimestamp
  private Date regdate;

  @ManyToOne
  @JoinColumn(name = "mno", referencedColumnName = "no")
  private Member member;
}
