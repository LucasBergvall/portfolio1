package com.example.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.entity.Address;
import com.example.entity.Member;
import com.example.repository.AddressRepository;
import com.example.repository.MemberRepository;
import com.example.util.TokenComponent;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository aRepository;
    private final TokenComponent tComponent;
    private final MemberRepository mRepository;
  
    @Override
    @Transactional
    public void setDefaultAddress(Long mno, Long ano) {
        List<Address> addresses = aRepository.findAllByMember_No(mno);
        for (Address addr : addresses) {
            addr.setDefaultAddress(addr.getNo().equals(ano));
        }
        aRepository.saveAll(addresses);
    }

    @Override
    public List<Address> getAddressesByMember(Long mno) {
        return aRepository.findAllByMember_No(mno);
    }

    @Override
    public Address saveAddress(Address address) {
        return aRepository.save(address);
    }

    @Override
    public void deleteAddress(Long ano) {
        aRepository.deleteById(ano);
    }

    @Override
    public void addAddress(String token, Address address) {
        Map<String, Object> userInfo = tComponent.validate(token);
        String userid = userInfo.get("userid").toString();

        Member member = mRepository.findByUserid(userid);
        if (member == null) throw new RuntimeException("회원을 찾을 수 없습니다.");

        address.setMember(member);
        address.setDefaultAddress(false); // 기본 배송지 아님
        aRepository.save(address);
    }
}
