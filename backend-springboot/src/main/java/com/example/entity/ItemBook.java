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
@Table(name = "item_book")
public class ItemBook {
  @Id
  @Column(name = "ino")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long ino;

  @Column(name = "book_name")
  private String bookName;

  @Column(name = "writer")
  private String writer;

  @Column(name = "publisher")
  private String publisher;

  @Column(name = "book_detail", columnDefinition = "LONGTEXT")
  private String bookDetail;

  @Column(name = "price")
  private Integer bookprice;

  @Column(name = "default_img")
  private String defaultImg = "/api2/itemimage/image?no=0";

  @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  @CreationTimestamp
  private Date regdate;

  @ManyToOne
  @JoinColumn(name = "gno", referencedColumnName = "no")
  private Genre genre;

  @OneToOne
  @MapsId
  @JoinColumn(name = "ino", referencedColumnName = "no" )
  @JsonProperty(access = Access.WRITE_ONLY)
  private Item item;
}
