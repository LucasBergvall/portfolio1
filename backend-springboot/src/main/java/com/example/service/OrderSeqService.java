package com.example.service;

import org.springframework.stereotype.Service;

import com.example.entity.OrderSeq;
import com.example.repository.OrderSeqRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderSeqService {

    private final OrderSeqRepository orderSeqRepository;

    public Long getNextOrderNo() {
        // INSERT 1건 생성 → 자동으로 id 증가
        OrderSeq seq = orderSeqRepository.save(new OrderSeq());
        return seq.getId();
    }
}

