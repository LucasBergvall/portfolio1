package com.example.service;

import com.example.dto.MemberUpdateDTO;
import com.example.dto.PasswordChangeDTO;
import com.example.entity.Member;

import org.springframework.stereotype.Service;

import java.util.Map;


@Service

public interface MemberService {

    Map<String, Object> login(Member loginRequest);

    Map<String, Object> loginbuyer(Member loginRequest);

    Map<String, Object> loginadmin(Member loginRequest);

    Map<String, Object> register(Member member);

    Map<String, Object> logout(String token);

    Map<String, Object> changePassword(String token, PasswordChangeDTO dto);
    

    boolean checkDuplicateUserId(String userid);

    boolean checkDuplicatedPhone(String phone);

    boolean checkDuplicatedNickname(String nickname);

    boolean checkDuplicatedEmail(String email);


    Map<String, Object> updateMember(String token, MemberUpdateDTO dto);

    Map<String, Object> getMemberInfo(String token);
}
