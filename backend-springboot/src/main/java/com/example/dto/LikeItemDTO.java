package com.example.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LikeItemDTO {
    private Long likeNo;
    private Long itemNo;
    private String title;
    private Integer bookprice;
    private Integer discount;
    private Long imageNo; // imgurl 대신 imageNo만 보냄
}
