package com.example.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.Member;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long>{

 Member findByUserid(String userid); 
 
 List<Member> findAllByUserid(String userid);

 Member findByEmail(String email);

 boolean existsByUserid(String userid);

 boolean existsByNickname(String nickname);

 boolean existsByEmail(String email);

 boolean existsByPhone(String phone);

}
  