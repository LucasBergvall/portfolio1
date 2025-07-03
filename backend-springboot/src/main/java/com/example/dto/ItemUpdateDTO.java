package com.example.dto;

import lombok.Data;

@Data
public class ItemUpdateDTO {
    private String title;
    private String explain;
    private Integer discount;
    private float price;
    private Long category;
    private Integer stock; // ✅ 추가
    private Integer bookprice;
    private String bookName;
    private String minVac;
    private String maxVac;
    private String writer;
    private String bookDetail;

}
