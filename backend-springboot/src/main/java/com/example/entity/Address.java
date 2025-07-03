package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import java.util.Date;

@Entity
@Data
@Table(name = "address")
public class Address {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long no;

  @Column(name = "address")
  private String address;

  @Column(name = "postno")
  private String postno;

  @Column(name = "road_address")
  private String road_address;

  @Column(name = "address_detail")
  private String address_detail;

  @Column(name = "city_name")
  private String city_name;

  @Column(name = "latitude")
  private Float latitude = 0.0f;

  @Column(name = "longitude")
  private Float longitude = 0.0f;

  @Column(name = "default_address", columnDefinition = "TINYINT(1)")
  private boolean defaultAddress;  // ✅ 기본 배송지 여부

  @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  @CreationTimestamp
  Date regdate;

  @JsonProperty(access = Access.WRITE_ONLY)
  @ManyToOne
  @JoinColumn(name = "mno", referencedColumnName = "no")
  private Member member;
}
