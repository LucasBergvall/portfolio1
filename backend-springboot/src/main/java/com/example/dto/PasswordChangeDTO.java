package com.example.dto;

import lombok.Data;

@Data
public class PasswordChangeDTO {
    private String currentpassword;
    private String newpassword;
}
