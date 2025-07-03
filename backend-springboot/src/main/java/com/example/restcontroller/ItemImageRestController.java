package com.example.restcontroller;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.entity.Item;
import com.example.entity.ItemImg;
import com.example.entity.Member;
import com.example.projection.ItemImgProjection;
import com.example.repository.ItemImageRespository;
import com.example.repository.ItemRepository;
import com.example.service.ItemImgService;
import com.example.util.TokenComponent;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api2/itemimage")
@RequiredArgsConstructor
public class ItemImageRestController {
    // 물품 이미지
    final ItemImageRespository iiRepository;
    final ResourceLoader rl;
    final ItemImgService itemImgService;
    final TokenComponent tComponent;
    final ItemRepository iRepository;
    // resource안의 이미지 정보 제공
    final ResourceLoader resourceLoader;

    // ✅ 해당 이미지 삭제
    // http://127.0.0.1:8080/api2/itemimage/deletebatch
    // 
    @DeleteMapping("/deletebatch")
    public Map<String, Object> imageDELETE(
        @RequestHeader("Authorization") String token,
        @RequestBody List<Long> listobj) {
        Map<String, Object> map = new HashMap<>();
        try {
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            List<Long> list = iRepository.findByMno(mno);
            iiRepository.deleteByNoInAndItem_NoIn(listobj, list);
            map.put("status", 1);
            map.put("message", "이미지가 삭제 됐습니다.");
        } catch (Exception e) {
            map.put("status", -1);
            map.put("error", e.getLocalizedMessage());
        }
        return map;
    }

    // ✅ 해당 이미지 삭제
    // http://127.0.0.1:8080/api2/itemimage/delete
    // 
    @DeleteMapping("/delete")
    public Map<String, Object> imageDELETE(
        @RequestHeader("Authorization") String token,
        @RequestBody ItemImg itemImg) {
        Map<String, Object> map = new HashMap<>();
        try {
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            List<Long> list = iRepository.findByMno(mno);
            iiRepository.deleteByNoAndItem_NoIn(itemImg.getNo(), list);
            map.put("status", 1);
            map.put("message", "이미지가 삭제 됐습니다.");
        } catch (Exception e) {
            map.put("status", -1);
            map.put("error", e.getLocalizedMessage());
        }
        return map;
    }


    // ✅ 이미지리스트트 표시하기 해당 아이템 이미지만 표시(상세보기)
    // http://127.0.0.1:8080/api2/itemimage/imagelist?ino=1
    // <img src = "/api2/itemimage/imagelist?ino=1" />
    @GetMapping("/imagelist")
    public Map<String, Object> imageListGET(
        @RequestParam(name = "ino") Long ino )
        throws IOException {
             Map<String, Object> map = new HashMap<>();
        // 번호를 이용해서 이미지 정보 가져오기
        List<ItemImgProjection> list = iiRepository.findAllByItem_NoOrderByImgDefaultDescRegdateAsc(ino);
        map.put("status", 1);
        map.put("list", list);
        return map;
    }


    // ✅ 이미지 등록
    // http://127.0.0.1:8080/api2/itemimage/insertbatch
    // headers {key: Authorization}, {value : Bearer TOKEN값} 
    /*  
    const itemimgData = {
        {"item" : {"no" : 7}}
    }   
    */
    @PostMapping("/insertbatch")
    public Map<String, Object> insertBatch(
        @RequestHeader("Authorization") String token,
        @RequestPart("ino") ItemImg ino,
        @RequestPart("img") MultipartFile[] imgs) {
        Map<String, Object> map = new HashMap<>();
          System.out.println(ino.getItem().getNo());  
       try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            Map<String, Object> userInfo = tComponent.validate(token);
            Integer seller = Integer.parseInt(userInfo.get("seller").toString());
            Member member = new Member();
            
            map.put("status", 0);
            map.put("result", "권한이 없습니다.");
            
            if(seller == 1) {
                // Long imgNo = itemImgService.uploadImage(obj, img);
                List<ItemImg> list = new ArrayList<>();
                if(iiRepository.countByItem_NoAndImgDefault(ino.getItem().getNo(),true) <= 0) {
                    int idx = 0;
                    for(MultipartFile img : imgs) {
                        ItemImg obj = new ItemImg();
                        Item item = new Item();
                        item.setNo(ino.getItem().getNo());
                        obj.setItem(item);
                        obj.setImgdata(img.getBytes());
                        obj.setImgname(img.getOriginalFilename());
                        obj.setImgtype(img.getContentType());
                        obj.setImgsize(img.getSize());
                        if(idx == 0) {
                            obj.setImgDefault(true);
                        }
                        else {
                            obj.setImgDefault(false);
                        }
                        list.add(obj);
                        idx++;
                    }
                }

                else {
                    for(MultipartFile img : imgs) {
                        ItemImg obj = new ItemImg();
                        Item item = new Item();
                        item.setNo(ino.getItem().getNo());
                        obj.setItem(item);
                        obj.setImgdata(img.getBytes());
                        obj.setImgname(img.getOriginalFilename());
                        obj.setImgtype(img.getContentType());
                        obj.setImgsize(img.getSize());
                        obj.setImgDefault(false);
                        list.add(obj);
                    }
                }
                
                iiRepository.saveAll(list);
                map.put("status", 1);
                map.put("result", "이미지가 일괄 등록 됐습니다."); 
            } 
                     
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getLocalizedMessage());
        }
        return map;
    }



    // ✅ 이미지 표시하기 GET 로그인 상관없이 표출
    // http://127.0.0.1:8080/api2/itemimage/image?no=1
    // <img src = "/api2/itemimage/image?no=1" />
    @GetMapping("/image")
    public ResponseEntity<byte[]> imageGET(@RequestParam(name = "no") Long no ) throws IOException {
        try {
            // 번호를 이용해서 이미지 정보 가져오기
            ItemImg obj = iiRepository.findById(no).orElse(null);
            
            if(obj != null) { // 이미지 정보가 있을 때때
                if(obj.getImgsize() > 0)  { // 파일의 용량이 있을 때때
                    // 이미지 종류
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.parseMediaType(obj.getImgtype()));

                    // (이미지 데이터, 파일 타입을 설정한 헤드, OK)
                    return new ResponseEntity<>(obj.getImgdata(), headers, HttpStatus.OK);
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
    

    // ✅ 이미지 등록
    // http://127.0.0.1:8080/api2/itemimage/insert
    // headers {key: Authorization}, {value : Bearer TOKEN값} 
    /*  const itemimgData = {
       "item" : {"no": 7}
    }
    */
    @PostMapping("/insert")
    public Map<String, Object> insertPOST(
        @RequestHeader("Authorization") String token,
        @RequestPart("ino") ItemImg obj,
        @RequestPart("img") MultipartFile img) {
        Map<String, Object> map = new HashMap<>();
            
       try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            Map<String, Object> userInfo = tComponent.validate(token);
            Integer seller = Integer.parseInt(userInfo.get("seller").toString());
            Member member = new Member();
            
            map.put("status", 0);
            map.put("result", "권한이 없습니다.");
            if(seller == 1) {
                // Long imgNo = itemImgService.uploadImage(obj, img);
                System.out.println(obj.toString());
                obj.setImgdata(img.getBytes());
                obj.setImgname(img.getOriginalFilename());
                obj.setImgtype(img.getContentType());
                obj.setImgsize(img.getSize());
                obj.setImgDefault(true);
                if(iiRepository.countByItem_NoAndImgDefault(obj.getItem().getNo(), true) > 0) {
                    obj.setImgDefault(false);
                }
                ItemImg itemImg = iiRepository.save(obj);
                map.put("status", 1);
                map.put("result", itemImg.getNo());
            }
                     
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getLocalizedMessage());
        }
        return map;
    }

    // // ✅ 전체 이미지 수정: 의미는 PUT, 기술적으로는 POST 사용
    // @PostMapping("/modify")
    // @Transactional
    // public Map<String, Object> modifyItemImages(@RequestParam("ino") Long item,
    //                                             @RequestPart("images") List<MultipartFile> images) {
    //     Map<String, Object> map = new HashMap<>();
    //     try {
    //         itemImgService.modifyImages(item, images);
    //         map.put("status", 1);
    //     } catch (Exception e) {
    //         map.put("status", -1);
    //         map.put("message", e.getMessage());
    //     }
    //     return map;
    // }

    // // ✅ 이미지 불러오기
    // @GetMapping("/image/{imgNo}")
    // public ResponseEntity<byte[]> image(@PathVariable Long imgNo) {
    //     try {
    //         ItemImg img = iiRepository.findById(imgNo).orElse(null);

    //         if (img == null || img.getImgdata() == null) {
    //             return ResponseEntity.notFound().build();
    //         }

    //         HttpHeaders headers = new HttpHeaders();
    //         headers.setContentType(MediaType.parseMediaType(img.getImgtype()));
    //         return new ResponseEntity<>(img.getImgdata(), headers, HttpStatus.OK);
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    //     }
    // }
}
