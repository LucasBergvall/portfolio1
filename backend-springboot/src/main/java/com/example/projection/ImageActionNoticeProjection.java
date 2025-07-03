package com.example.projection;

public interface ImageActionNoticeProjection {

  Long getNo();

  Notice getNotice();

  Img getImg();

    interface Img {
        Long getNo(); // Img 엔티티의 No만 가져오기
    }
  
    interface Notice {
        Long getNo(); // Board 엔티티의 No만 가져오기
    }
}
