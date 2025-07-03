package com.example.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.example.entity.Item;
import com.example.entity.ItemImg;

import lombok.Data;

@Data
public class ItemDTO {
    private Long no;
    private String title;
    private int discount;
    private List<Long> imgNoList;
    private List<String> imgUrlList=new ArrayList<>();
    private String type;
    private String explain;
    private Long memberNo;
    private String userid;
    private Integer stock;
   

    // ✅ 도서 전용 정보
    private String bookName;
    private String writer;
    private String bookDetail;
    private String thumbnail; // ✅ 대표 이미지 URL 추가
    private Integer price;
    private Long genre;
    private String genreName;
    private String publisher;
    

    public ItemDTO(Item item) {
        
        this.no = item.getNo();
        this.title = item.getTitle();
        this.discount = item.getDiscount();
        this.explain = item.getExplain();
        this.memberNo = item.getMember().getNo();
        this.userid = item.getMember().getUserid();
        this.stock = item.getStock();
        this.genre = item.getItemBook().getGenre().getNo();
        this.genreName = item.getItemBook().getGenre().getGenreName();
        this.thumbnail = item.getItemBook().getDefaultImg();
        this.price = item.getItemBook().getBookprice();



        // 이미지 처리
        if (item.getItemImgList() != null && !item.getItemImgList().isEmpty()) {
           this.imgNoList = item.getItemImgList().stream()
                .map(ItemImg::getNo)

                 .collect(Collectors.toList());

            for(Long img:imgNoList){
                System.out.println(img);
                imgUrlList.add("/api2/itemimage/image?no=" + img);
            }

            

            this.thumbnail = "/api2/itemimage/image?no=" + imgNoList.get(0);
        }


        if (item.getItemBook() != null) {
            this.type = "book";
            this.price = item.getItemBook().getBookprice();
            this.bookName = item.getItemBook().getBookName();
            this.writer = item.getItemBook().getWriter();
            this.bookDetail = item.getItemBook().getBookDetail();
            this.publisher = item.getItemBook().getPublisher();
            this.writer = item.getItemBook().getWriter();
            this.thumbnail = item.getItemBook().getDefaultImg();
        }
    }
}
