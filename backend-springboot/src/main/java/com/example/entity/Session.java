package com.example.entity;


import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "session")
public class Session {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int no;

  @Column(name = "session_id", nullable = false)
  private String sessionId;

  @Column(name = "token", nullable = false)
  private String token;

  @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  @CreationTimestamp
  Date regdate;
}
