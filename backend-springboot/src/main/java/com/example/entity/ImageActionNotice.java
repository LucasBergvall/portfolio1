package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "image_action_notice")
public class ImageActionNotice {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long no;

  @ManyToOne
  @JoinColumn(name = "imno", referencedColumnName = "no")
  private Img img;

  @ManyToOne
  @JoinColumn(name = "nno", referencedColumnName = "no")
  private Notice notice;

  @Column(name = "img_default", columnDefinition = "TINYINT(1)") // 대표 이미지 여부
  private Boolean imgDefault;
}
