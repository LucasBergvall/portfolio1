package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "image_action_css")
public class ImageActionCss {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long no;

  @ManyToOne
  @JoinColumn(name = "csno", referencedColumnName = "no")
  private Cssolution cssolution;

  @ManyToOne
  @JoinColumn(name = "imno", referencedColumnName = "no")
  private Img img;
}
