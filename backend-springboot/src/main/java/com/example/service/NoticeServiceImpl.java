package com.example.service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.entity.Board;
import com.example.entity.ImageActionBoard;
import com.example.entity.ImageActionNotice;
import com.example.entity.Img;
import com.example.entity.Notice;
import com.example.projection.ImageActionNoticeProjection;
import com.example.repository.ImageActionNoticeRepository;
import com.example.repository.ImgRepository;
import com.example.repository.NoticeRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoticeServiceImpl {

  private final ImageActionNoticeRepository imageActionNoticeRepository;
  private final NoticeRepository nRepository;
  private final ImgRepository imgRepository;


   @Transactional
   public void deleteNotice(Long no) {
    // 게시글 번호를 이용해서 해당하는 이미지액션보드 no를 가져온다.
    List<ImageActionNoticeProjection> list = imageActionNoticeRepository.findByNotice_No(no);

    // 이미지 액션보드에서 noticeno를 읽어서 삭제
    imageActionNoticeRepository.deleteByNotice_No(no);
    
    // 반복문을 돌려서 이미지 번호를 읽어서 이미지 저장소에 하나씩 삭제
    for(ImageActionNoticeProjection imageActionNotice : list) {
      imgRepository.deleteById(imageActionNotice.getImg().getNo());
    }

    // 게시판에서 게시판 번호로 삭제
    nRepository.deleteById(no);
  }

  @Transactional
  public void InsertNotice(Notice notice, MultipartFile[] imgs) throws IOException {
    Notice obj = nRepository.save(notice);
    
    int idx = 0;
    for(MultipartFile img : imgs) {
      if(!img.isEmpty()) {
        Img img2 = new Img();
        img2.setData(img.getBytes());
        img2.setName(img.getOriginalFilename());
        img2.setType(img.getContentType());
        img2.setSize(img.getSize());
            
        Img img3 = imgRepository.save(img2);

        ImageActionNotice imageActionNotice = new ImageActionNotice();

        imageActionNotice.setNotice(obj);;
        imageActionNotice.setImg(img3);
        if (idx == 0) {
          imageActionNotice.setImgDefault(true);
        }
        else {
          imageActionNotice.setImgDefault(false);
        } 
        idx++;
        imageActionNoticeRepository.save(imageActionNotice);
      }
    }
  }

  @Transactional
  public void modifyNoticeImages(Long noticeNo, MultipartFile[] imgs) throws IOException {
      Notice notice = nRepository.findById(noticeNo)
          .orElseThrow(() -> new IllegalArgumentException("게시글 없음"));

      boolean isFirst = true;  // 🔥 여기에 선언 (초기값 true)
      
      for (MultipartFile img : imgs) {
          if (!img.isEmpty()) {
              Img img2 = new Img();
              img2.setData(img.getBytes());
              img2.setName(img.getOriginalFilename());
              img2.setType(img.getContentType());
              img2.setSize(img.getSize());
              Img savedImg = imgRepository.save(img2);

              ImageActionNotice imageActionNotice = new ImageActionNotice();
              imageActionNotice.setNotice(notice);
              imageActionNotice.setImg(savedImg);
              imageActionNotice.setImgDefault(isFirst);
              imageActionNoticeRepository.save(imageActionNotice);
          
              isFirst = false;
            }
      }
  }

} 
