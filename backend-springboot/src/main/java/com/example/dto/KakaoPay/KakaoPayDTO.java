package com.example.dto.KakaoPay;

import lombok.Data;

@Data
public class KakaoPayDTO {
    private String tid;
    private String next_redirect_pc_url;
    private String created_at;
}

