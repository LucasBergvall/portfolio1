package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Entity
@Data
@Table(name = "tool")
public class Tool {
  @Id
  private Long ino;

  @Column(name = "price")
  private float price;

  @Column(name = "material")
  private String material;

  @Column(name = "weight")
  private int weight;

  @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  @CreationTimestamp
  private Date regdate;

  @ManyToOne
  @JoinColumn(name = "cno", referencedColumnName = "no")
  private Category category;

  @OneToOne
  @JoinColumn(name = "ino")
  private ItemTool itemTool;
}
