package com.example.util;

public enum CheckMessage {
    UNAVAILABLE_ID("이미 사용중인 ID 입니다."),
    UNAVAILABLE_NICKNAME("이미 사용중인 닉네임 입니다."),
    UNAVAILABLE_EMAIL("이미 등록된 email입니다."),
    UNAVAILABLE_PHONE("이미 등록된 전화번호 입니다.");

    private final String message;

    CheckMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}

