package com.example.entity;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Data
@NoArgsConstructor  // ✅ 기본 생성자 생성
@AllArgsConstructor // ✅ builder용 생성자
@Table(name = "member") // 테이블 명
public class Member {
  
  @Id
  @Column(name = "no")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long no;

  @Column(name = "nickname", unique = true, nullable = false)
  private String nickname;

  @Column(name = "id", unique = true, nullable = false)
  private String userid;

  @JsonProperty(access = Access.WRITE_ONLY)
  @Column(name = "password", nullable = false)
  private String password;

  @Column(name = "email", unique = true, nullable = false)
  private String email; 

  @Column(name = "phone", unique = true, nullable = false)
  private String phone;

  @Column(name = "avg_evaluation")
  private float avg_evaluation;

  @Column(name = "buyer")
  private int buyer;

  @Column(name = "seller")
  private int seller;

  @Column(name = "admin")
  private int admin;

  @Column(name = "cancel_enable")
  private int cancel_enable = 1;

  @Transient
  @Column(name = "newpassword")
  private String newpassword;

  @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  @CreationTimestamp
  private Date regdate;

  @OneToMany(mappedBy = "member")
  @com.fasterxml.jackson.annotation.JsonIgnore
  private List<Event> events = new ArrayList<>();
}
