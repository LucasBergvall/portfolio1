package com.example.service;

import java.util.List;

import com.example.entity.Address;

public interface AddressService {
    void setDefaultAddress(Long mno, Long ano);
    List<Address> getAddressesByMember(Long mno);
    Address saveAddress(Address address);
    void deleteAddress(Long ano);
    void addAddress(String token, Address address);
}
