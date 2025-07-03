package com.example.entity;

import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@Data
@JsonIgnoreProperties({"itemTool", "itemBook"}) 
@NoArgsConstructor  // ✅ 기본 생성자 생성
@AllArgsConstructor // ✅ builder용 생성자
@Table(name = "item")
public class Item {
  @Id
  @Column(name = "no")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long no;

  @Column(name = "stock")
  private Integer stock;

  @Column(name = "title")
  private String title;

  @Column(name = "`explain`", columnDefinition = "LONGTEXT")
  private String explain;

  @Column(name = "`discount`")
  private Integer discount;

  @Column(name = "sale_status")
  private int saleStatus;
  // 판매완료 된 상품 0 / 판매중인 상품 1 / 판매 취소 상품 2
  // 재고가 150개 중에 70개를 팔고 80개가 남은 상태에서 판매 취소 할 시 2번으로 담기게끔

  @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
  @JsonFormat(shape = JsonFormat.Shape.STRING,
              pattern = "yyyy-MM-dd HH:mm")
  @CreationTimestamp
  private Date regdate;

  @ManyToOne
  @JsonProperty(access = Access.WRITE_ONLY)
  @JoinColumn(name = "mno", referencedColumnName = "no")
  private Member member;

  @OneToOne(mappedBy = "item")
  private ItemTool itemTool;

  @OneToOne(mappedBy = "item", cascade = CascadeType.ALL)
  private ItemBook itemBook;

  public void setItemBook(ItemBook itemBook) {
        this.itemBook = itemBook;
        itemBook.setItem(this); // 양방향 관계 설정
    }

  @JsonProperty(access = Access.WRITE_ONLY)
  @OneToMany(mappedBy = "item")
  @OrderBy("imgDefault Desc") // 또는 "imgNo DESC"
  private List<ItemImg> itemImgList;

  public Item(Long no) {
    this.no = no;
  }

  @Transient
  String default_img_url;

  @Transient
  ItemBook book;

  @Transient
  List<String> notdefaultimgs;

  @Transient
  Integer bookprice;

  @Transient
  String genreName;

  @Transient
  @JsonProperty("writer")
  private String writer;
}
