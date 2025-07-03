package com.example.projection;

public interface ImageActionBoardProjection {
  
  Long getNo();

  Board getBoard();

  Img getImg();

    interface Img {
        Long getNo(); // Img 엔티티의 No만 가져오기
    }
  
    interface Board {
        Long getNo(); // Board 엔티티의 No만 가져오기
    }
}
