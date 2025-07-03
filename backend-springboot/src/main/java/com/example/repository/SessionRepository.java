package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.Session;

@Repository
public interface SessionRepository extends JpaRepository<Session, Integer> {

    // ✅ 토큰으로 세션 조회 (로그아웃용)
    Session findByToken(String token);

    // ✅ 세션 ID로 삭제 (회원 탈퇴 등에서 사용 가능)
    void deleteBySessionId(String sessionId);

    Session findBySessionId(String sessionId);
}
