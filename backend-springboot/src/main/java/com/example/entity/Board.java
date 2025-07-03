package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;

@Entity
@Data
@Table(name = "board")
public class Board {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "no")
  private Long no;

  @Column(name = "title")
  private String title;

  @Column(name = "text")
  private String text;

  @Column(name = "hit")
  private Long hit = 1L;

  @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  @CreationTimestamp
  private Date regdate;

  @ManyToOne
  @JoinColumn(name = "mno", referencedColumnName = "no")
  private Member member;

  @Transient
  private String defaultImg;

  // ✅ 댓글 리스트 - 게시글 삭제 시 댓글도 같이 삭제됨
  @OneToMany(mappedBy = "board", cascade = CascadeType.REMOVE, orphanRemoval = true)
  private List<Reply> replyList;
}
