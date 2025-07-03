package com.example.util;

import org.springframework.stereotype.Component;

import com.example.entity.Member;
import com.example.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MemberCheckUtil {
    private final MemberRepository memberRepository;

    public String addCheck(Member member) {
        if (memberRepository.existsByUserid(member.getUserid())) {
            return CheckMessage.UNAVAILABLE_ID.getMessage();
        }

        if (memberRepository.existsByNickname(member.getNickname())) {
            return CheckMessage.UNAVAILABLE_NICKNAME.getMessage();
        }

        if (memberRepository.existsByEmail(member.getEmail())) {
            return CheckMessage.UNAVAILABLE_EMAIL.getMessage();
        }

        if (memberRepository.existsByPhone(member.getPhone())) {
            return CheckMessage.UNAVAILABLE_PHONE.getMessage();
        }

        return null; // 중복 없음
    }
}
