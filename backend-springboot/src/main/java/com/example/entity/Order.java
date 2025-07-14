package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.Date;

@Entity
@Data
@Table(name = "`order`")
public class Order {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long no;

  @Column(name = "quantity")
  private Long quantity;

  @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  @JsonFormat(shape = JsonFormat.Shape.STRING,
              pattern = "yyyy-MM-dd HH:mm")
  @CreationTimestamp
  // @UpdateTimestamp
  private Date regdate;

  @ManyToOne
  // @JsonProperty(access = Access.WRITE_ONLY)
  @JoinColumn(name = "mno", referencedColumnName = "no")
  private Member member;

  @OneToOne
  @JoinColumn(name = "ino")
  private Item item;

  @Transient
  Review review;

  @Transient
  private Long paymentHistoryActionNo;

  @Transient
  private Long sellerNo;

  @Transient
  private Long count;
}
