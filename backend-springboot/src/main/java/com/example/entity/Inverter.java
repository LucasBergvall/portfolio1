package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Entity
@Data
@Table(name = "inverter")
public class Inverter {
  @Id
  private Long ino;

  @Column(name = "price")
  private float price;

  @Column(name = "min_vac")
  private String min_vac;

  @Column(name = "max_vac")
  private String max_vac;

  @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  @CreationTimestamp
  private Date regdate;

  @OneToOne
  @MapsId
  @JoinColumn(name = "ino")
  private ItemTool itemTool;
}
