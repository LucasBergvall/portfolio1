package com.example.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.entity.ItemImg;

public interface ItemImgService {
    Long uploadImage(ItemImg obj, MultipartFile img);
    void modifyImages(Long ino, List<MultipartFile> images);
    byte[] getImageData(Long imgNo);
}