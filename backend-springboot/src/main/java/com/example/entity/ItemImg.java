package com.example.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Entity // JPA에서 테이블로 매핑되는 클래스임을 나타냄
@Data // Lombok - getter/setter, toString 등 자동 생성
@Table(name = "item_img") // 테이블 이름을 "item_img"로 지정
public class ItemImg {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long no;

  @Column(name = "imgtype") // MIME 타입 (image/png 등)
  private String imgtype;

  @Column(name = "imgdata") // 실제 이미지 바이트 데이터
  private byte[] imgdata;

  @Column(name = "imgsize") // 이미지 크기(byte)
  private Long imgsize;

  @Column(name = "imgname") // 원본 파일명
  private String imgname;

  @Column(name = "img_trans") // 추후 전처리용(필요시 사용)
  private String imgTrans;

  @Column(name = "img_default", columnDefinition = "TINYINT(1)") // 대표 이미지 여부
  
  private Boolean imgDefault;

  @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") // 날짜 포맷 지정
  @CreationTimestamp // 등록 시 자동으로 현재 시간 저장
  private Date regdate;

  @ManyToOne // Item과 다대일 관계
  @JoinColumn(name = "ino", referencedColumnName = "no") // 외래키: item.no 참조
  private Item item;
}
