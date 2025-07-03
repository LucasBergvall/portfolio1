package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import java.util.Date;

@Entity
@Data
@Table(name = "image_action_board")
public class ImageActionBoard {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long no;

  @DateTimeFormat(pattern = "yyyy-DD-mm HH:mm:ss")
  @CreationTimestamp
  private Date regdate;

  @ManyToOne
  @JsonProperty(access = Access.WRITE_ONLY)
  @JoinColumn(name = "imno", referencedColumnName = "no")
  private Img img;

  @ManyToOne
  @JsonProperty(access = Access.WRITE_ONLY)
  @JoinColumn(name = "bno", referencedColumnName = "no")
  private Board board;

  @Column(name = "img_default", columnDefinition = "TINYINT(1)") // 대표 이미지 여부
  private Boolean imgDefault;
}
