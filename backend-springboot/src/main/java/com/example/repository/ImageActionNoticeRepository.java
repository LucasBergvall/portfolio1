package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.entity.ImageActionNotice;
import com.example.projection.ImageActionNoticeProjection;

import jakarta.transaction.Transactional;


@Repository
public interface ImageActionNoticeRepository extends JpaRepository<ImageActionNotice, Long> {

  List<ImageActionNoticeProjection>  findByNotice_No(Long no);

  void deleteByNotice_No(Long nno);

   ImageActionNotice findByNotice_NoAndImgDefault(Long nno, Boolean imgDefault);

   @Transactional
    void deleteByNotice_NoAndImg_No(Long nno, Long imno);

    
}

