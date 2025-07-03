package com.example.service;

import com.example.dto.MemberUpdateDTO;
import com.example.dto.PasswordChangeDTO;
import com.example.entity.Member;
import com.example.entity.Session;
import com.example.repository.AddressRepository;
import com.example.repository.MemberRepository;
import com.example.repository.SessionRepository;
import com.example.util.MemberCheckUtil;
import com.example.util.TokenComponent;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final SessionRepository sessionRepository;
    private final TokenComponent tokenComponent;
    private final AddressRepository aRepository;
    private final MemberCheckUtil memberCheckUtil;

    @Override
    public Map<String, Object> login(Member loginRequest) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Member> members = memberRepository.findAllByUserid(loginRequest.getUserid());
            if (members.size() != 1) {
                throw new RuntimeException("중복된 사용자 ID 또는 존재하지 않음");
            }

            Member member = members.get(0);
            
            if (loginRequest.getPassword().equals(member.getPassword())) {
                if(member.getSeller() != 1 && member.getAdmin() != 1) {
                    result.put("status", 0);
                    result.put("message", "판매자 권한이 없습니다.");
                    return result;
                }

                String token = tokenComponent.create(
                    member.getNo(),
                    member.getUserid(),
                    member.getNickname(),
                    member.getBuyer(),
                    member.getSeller(),
                    member.getAdmin());

                if (token == null) throw new RuntimeException("Token creation failed");

                Session existing = sessionRepository.findBySessionId(member.getUserid());
                if (existing != null) sessionRepository.delete(existing);

                Session session = new Session();
                session.setSessionId(member.getUserid());
                session.setToken(token);
                sessionRepository.save(session);

                result.put("status", 1);
                result.put("message", "로그인 성공");
                result.put("token", token);
                result.put("nickname", member.getNickname());
            } else {
                result.put("status", 0);
                result.put("message", "ID 또는 비밀번호가 일치하지 않습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace(); // ✅ 콘솔에서 원인 확인
            result.put("status", -1);
            result.put("message", "서버 오류: " + e.getMessage()); // ✅ 예외 메시지 포함
        }
        return result;
    }


    @Override
    public Map<String, Object> loginbuyer(Member loginRequest) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Member> members = memberRepository.findAllByUserid(loginRequest.getUserid());
            if (members.size() != 1) {
                throw new RuntimeException("중복된 사용자 ID 또는 존재하지 않음");
            }

            Member member = members.get(0);

            if (loginRequest.getPassword().equals(member.getPassword())) {
                if(member.getBuyer() != 1 && member.getAdmin() != 1) {
                    result.put("status", 0);
                    result.put("message", "구매자 권한이 없습니다.");
                    return result;
                }
                String token = tokenComponent.create(
                    member.getNo(),
                    member.getUserid(),
                    member.getNickname(),
                    member.getBuyer(),
                    member.getSeller(),
                    member.getAdmin());

                if (token == null) throw new RuntimeException("Token creation failed");

                Session existing = sessionRepository.findBySessionId(member.getUserid());
                if (existing != null) sessionRepository.delete(existing);

                Session session = new Session();
                session.setSessionId(member.getUserid());
                session.setToken(token);
                sessionRepository.save(session);

                result.put("status", 1);
                result.put("message", "로그인 성공");
                result.put("token", token);
                result.put("nickname", member.getNickname());
                result.put("userid", member.getUserid());
            } else {
                result.put("status", 0);
                result.put("message", "ID 또는 비밀번호가 일치하지 않습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace(); // ✅ 콘솔에서 원인 확인
            result.put("status", -1);
            result.put("message", "서버 오류: " +   e.getMessage()); // ✅ 예외 메시지 포함
        }
        return result;
    }

    @Override
    public Map<String, Object> loginadmin(Member loginRequest) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<Member> members = memberRepository.findAllByUserid(loginRequest.getUserid());
            if (members.size() != 1) {
                throw new RuntimeException("중복된 사용자 ID 또는 존재하지 않음");
            }

            Member member = members.get(0);

            if (loginRequest.getPassword().equals(member.getPassword())) {
                if(member.getAdmin() != 1) {
                    result.put("status", 0);
                    result.put("message", "관리자 권한이 없습니다.");
                    return result;
                }
                String token = tokenComponent.create(
                    member.getNo(),
                    member.getUserid(),
                    member.getNickname(),
                    member.getBuyer(),
                    member.getSeller(),
                    member.getAdmin());

                if (token == null) throw new RuntimeException("Token creation failed");

                Session existing = sessionRepository.findBySessionId(member.getUserid());
                if (existing != null) sessionRepository.delete(existing);

                Session session = new Session();
                session.setSessionId(member.getUserid());
                session.setToken(token);
                sessionRepository.save(session);

                result.put("status", 1);
                result.put("message", "로그인 성공");
                result.put("token", token);
                result.put("nickname", member.getNickname());
                result.put("userid", member.getUserid());
            } else {
                result.put("status", 0);
                result.put("message", "ID 또는 비밀번호가 일치하지 않습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace(); // ✅ 콘솔에서 원인 확인
            result.put("status", -1);
            result.put("message", "서버 오류: " +   e.getMessage()); // ✅ 예외 메시지 포함
        }
        return result;
    }
    


    @Override
    public Map<String, Object> register(Member member) {
        Map<String, Object> result = new HashMap<>();
        String message = memberCheckUtil.addCheck(member);
        if (message != null) {
            result.put("status", -1);
            result.put("message", message);
            return result;
        }

        // 회원정보 저장 하고 저장된 정보를 retMember
        Member retMember = memberRepository.save(member);

        result.put("mno", retMember.getNo());
        result.put("status", 1);
        result.put("message", "회원가입 성공");
        return result;
    }

    @Override
    public boolean checkDuplicateUserId(String userid) {
        return memberRepository.existsByUserid(userid);
    }

    @Override
    public boolean checkDuplicatedNickname(String nickname) {
        return memberRepository.existsByNickname(nickname);
    }

    @Override
    public boolean checkDuplicatedEmail(String email) {
        return memberRepository.existsByEmail(email);
    }

    @Override
    public boolean checkDuplicatedPhone(String phone) {
        return memberRepository.existsByPhone(phone);
    }

    @Override
    public Map<String, Object> logout(String token) {
        Map<String, Object> result = new HashMap<>();
        Session session = sessionRepository.findByToken(token);
        if (session != null) {
            sessionRepository.delete(session);
            result.put("status", 1);
            result.put("message", "로그아웃 성공");
        } else {
            result.put("status", 0);
            result.put("message", "이미 만료된 토큰입니다.");
        }
        return result;
    }

   @Override
    public Map<String, Object> updateMember(String token, MemberUpdateDTO dto) {
        Map<String, Object> result = new HashMap<>();

        Map<String, Object> userInfo = tokenComponent.validate(token);
        String userid = userInfo.get("userid").toString();

        List<Member> members = memberRepository.findAllByUserid(userid);
        if (members.size() != 1) {
            result.put("status", 0);
            result.put("message", "해당 사용자를 찾을 수 없습니다.");
            return result;
        }

        Member member = members.get(0);

        if (dto.getNickname() != null) {
            member.setNickname(dto.getNickname());
        }

        if (dto.getPhone() != null) {
            member.setPhone(dto.getPhone());
        }

        memberRepository.save(member);

        result.put("status", 1);
        result.put("message", "회원정보가 수정되었습니다.");
        return result;
    }

    @Override
    public Map<String, Object> getMemberInfo(String token) {
        Map<String, Object> userInfo = tokenComponent.validate(token);
        String userid = userInfo.get("userid").toString();

        List<Member> members = memberRepository.findAllByUserid(userid);
        if (members.size() != 1) throw new RuntimeException("해당 사용자를 찾을 수 없습니다.");

        Member member = members.get(0);

        Map<String, Object> result = new HashMap<>();
        result.put("userid", member.getUserid());
        result.put("nickname", member.getNickname());
        result.put("phone", member.getPhone());
        result.put("addresses", aRepository.findByMember(member));

        return result;
    }

    @Override
    public Map<String, Object> changePassword(String token, PasswordChangeDTO dto) {
        Map<String, Object> result = new HashMap<>();

        Map<String, Object> userInfo = tokenComponent.validate(token);
        String userid = userInfo.get("userid").toString();

        List<Member> members = memberRepository.findAllByUserid(userid);
        if (members.size() != 1) {
            result.put("status", 0);
            result.put("message", "해당 사용자를 찾을 수 없습니다.");
            return result;
        }

        Member member = members.get(0);

        // 현재 비밀번호 일치 확인
        if (!member.getPassword().equals(dto.getCurrentpassword())) {
            result.put("status", -1);
            result.put("message", "현재 비밀번호가 일치하지 않습니다.");
            return result;
        }

        // 새 비밀번호 설정
        member.setPassword(dto.getNewpassword());
        memberRepository.save(member);

        result.put("status", 1);
        result.put("message", "비밀번호가 성공적으로 변경되었습니다.");
        return result;
    }
}
