package com.example.restcontroller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.entity.Item;
import com.example.entity.ItemBook;
import com.example.projection.ItemImgProjection;
import com.example.repository.ItemBookRepository;
import com.example.repository.ItemImageRespository;
import com.example.repository.ItemRepository;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api2/itemdetail")
public class ItemDetailRestController {

  final private ItemRepository iRepository;
  final private ItemImageRespository iiRespository;
  final private ItemBookRepository ibRepository;
  
  // 물품 번호에따라서 상세정보 가져오기
  // http://127.0.0.1:8080/api2/itemdetail/getitem?no=5

  @GetMapping("/getitem")
  public Map<String, Object> getItemdetail(
      @RequestParam Long no) {
      
      Map<String, Object> map = new HashMap<>();
      try {
            // 아이템 번호를 이용해서 아이템 정보를 가져오기 
            Item item = iRepository.findById(no).orElse(null);

            // 아이템 번호와 대표이미지를 참인지 거짓인지 판별해서 1개만 가져오기
            ItemImgProjection itemImgProjection = iiRespository.findByItem_NoAndImgDefault(no, true);

            // 기본이미지url 설정
            item.setDefault_img_url("/api2/itemimage/image?no=0");
            if (itemImgProjection != null) {
              item.setDefault_img_url("/api2/itemimage/image?no=" + itemImgProjection.getNo());
            }
            // 아이템북으로 부터 상세 내역 가져오기
            ItemBook itemBook = ibRepository.findById(no).orElse(null);
            item.setBook(itemBook);
            
            List<ItemImgProjection> list =  iiRespository.findAllByItem_NoAndImgDefault(no, false);
            List<String> list2 = new ArrayList<>();
            if(list != null){
              for(ItemImgProjection obj : list){
                if(obj != null) {
                  list2.add("/api2/itemimage/image?no=" + obj.getNo());
                }
              }
            }
            item.setNotdefaultimgs(list2);
            map.put("status", 1);
            map.put("obj", item);
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
  }
  
}
