package com.example.dto;

import java.util.Date;

import lombok.Data;

@Data
public class BoardDTO {
  private Long no;
  private String title;
  private String text;
  private Long hit;
  private Date regdate;

  @Data
  public static class Member {
    private Long no;
    private String nickname;
    private String userid;
  }

}
