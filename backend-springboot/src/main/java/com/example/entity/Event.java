package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Entity
@Data
@Table(name = "event")
public class Event {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long no;

  @Column(name = "title")
  private String title;

  @Column(name = "context")
  private String context;

  @Column(name = "dday")
  private String dday;

  @Column(name = "event_discount")
  private int event_discount;

  @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  @CreationTimestamp
  private Date regdate;

  @ManyToOne
  @JoinColumn(name = "mno", referencedColumnName = "no")
  private Member member;

  @ManyToOne
  @JoinColumn(name = "ino", referencedColumnName = "no")
  private Item item;
}
