package com.example.dto;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewListDTO {
    private Long reviewNo;
    private String review;
    private int evaluation;
    private Date regdate;
    private int pay;
    private Long quantity;
    private int bookprice;
    private String defaultImg;  // ⭐ 추가
}
