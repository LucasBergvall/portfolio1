package com.example.repository;

import com.example.entity.Address;
import com.example.entity.Member;

import jakarta.transaction.Transactional;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
   List<Address> findAllByMember_No(Long no);
   List<Address> findByMember(Member member);
   
   @Transactional
   void deleteByNoAndMember_No(Long no, Long mno);

   List<Address> findAllByMember_NoOrderByDefaultAddressDescRegdateAsc(Long no);
}