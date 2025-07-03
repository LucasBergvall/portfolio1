package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Entity
@Data
@Table(name = "preorder")
public class Preorder {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long no;

  @Column(name = "name")
  private String name;

  @Column(name = "phone")
  private String phone;

  @Column(name = "email")
  private String email;

  @Column(name = "benefit")
  private String benefit;

  @Column(name = "dday")
  private String dday;

  @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  @CreationTimestamp
  private Date regdate;

  @ManyToOne
  @JoinColumn(name = "eno", referencedColumnName = "no")
  private Event event;

  @ManyToOne
  @JoinColumn(name = "ino", referencedColumnName = "no")
  private Item item;
}
