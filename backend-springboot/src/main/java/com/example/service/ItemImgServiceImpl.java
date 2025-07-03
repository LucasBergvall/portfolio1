package com.example.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.entity.Item;
import com.example.entity.ItemImg;
import com.example.projection.ItemImgProjection;
import com.example.repository.ItemImageRespository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ItemImgServiceImpl implements ItemImgService {

    private final ItemImageRespository iiRepository;

    @Override
    public Long uploadImage(ItemImg obj, MultipartFile img) {
        try {
            obj.setImgname(img.getOriginalFilename());
            obj.setImgsize(img.getSize());
            obj.setImgtype(img.getContentType());
            obj.setImgdata(img.getBytes());
            obj.setImgTrans("");
            // obj.setImgurl("/images/" + img.getOriginalFilename());

            ItemImg saved = iiRepository.save(obj);
            return saved.getNo();
        } catch (Exception e) {
            throw new RuntimeException("이미지 저장 실패", e);
        }
    }

    @Override
    @Transactional
    public void modifyImages(Long no, List<MultipartFile> images) {
        System.out.println("AA");
        ItemImgProjection itemImgProjection = iiRepository.findByItem_NoAndImgDefault(no, true);
        System.out.println(itemImgProjection.getNo());
        iiRepository.deleteByItem_No(no);
        for (MultipartFile img : images) {
            if (!img.isEmpty()) {
                ItemImg obj = new ItemImg();
                try {
                    obj.setImgname(img.getOriginalFilename());
                    obj.setImgsize(img.getSize());
                    obj.setImgtype(img.getContentType());
                    obj.setImgdata(img.getBytes());
                    obj.setImgTrans("");
                    // obj.setImgurl("/images/" + img.getOriginalFilename());
                    obj.setItem(new Item(no));
                    iiRepository.save(obj);
                } catch (Exception e) {
                    throw new RuntimeException("이미지 저장 실패", e);
                }
            }
        }
    }

    @Override
    public byte[] getImageData(Long imgNo) {
        return iiRepository.findById(imgNo)
                .map(ItemImg::getImgdata)
                .orElseThrow(() -> new RuntimeException("이미지 없음"));
    }
}
