package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Entity
@Data
@Table(name = "image_action_normal_chatbot")
public class ImageActionNormalChatbot {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long no;

  @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  @CreationTimestamp
  private Date regdate;

  @ManyToOne
  @JoinColumn(name = "ncno", referencedColumnName = "no")
  private NormalChatbot normalChatbot;

  @ManyToOne
  @JoinColumn(name = "imno", referencedColumnName = "no")
  private Img img;
}
