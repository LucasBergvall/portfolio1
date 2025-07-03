package com.example.restcontroller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


import com.example.entity.Img;
import com.example.repository.ImgRepository;

import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequiredArgsConstructor
@RequestMapping("/api2/img")
public class ImgRestController {
  
    private final ResourceLoader resourceLoader;
    private final ImgRepository imgRepository;

  // 이미지, 게시판, 공지사항, 이벤트 페이지 등등... 에 쓸 이미지
  // 127.0.0.1:8080/api2/img/image?no=11
  @GetMapping("/image")
    public ResponseEntity<byte[]> imageGET(@RequestParam(name = "no") Long no ) throws IOException {
        try {
            // 번호를 이용해서 이미지 정보 가져오기
            Img obj = imgRepository.findById(no).orElse(null);
            
            if(obj != null) { // 이미지 정보가 있을 때때
                if(obj.getSize() > 0)  { // 파일의 용량이 있을 때때
                    // 이미지 종류
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.parseMediaType(obj.getType()));

                    // (이미지 데이터, 파일 타입을 설정한 헤드, OK)
                    return new ResponseEntity<>(obj.getData(), headers, HttpStatus.OK);
                }
            }    
            throw new Exception();
        } catch(Exception e) {
            InputStream is = resourceLoader.getResource("classpath:/static/image/noimages.jpg").getInputStream();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_JPEG);
            return new ResponseEntity<byte[]>(is.readAllBytes(), headers, HttpStatus.OK);
          
        }
    }

    
}
