package com.example.restcontroller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.entity.Genre;
import com.example.entity.ItemBook;
import com.example.projection.ItemImgProjection;
import com.example.repository.GenreRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api2/genre")
@RequiredArgsConstructor
public class GenreRestController {

  private final GenreRepository genreRepository;

    //고객용 등록된 상품 열람
    // http://127.0.0.1:8080/api2/genre/selectitemlist
    @GetMapping("/selectitemlist")
    public Map<String, Object> selectItemList(
        ) {
        
        Map<String, Object> map = new HashMap<>();
        try {
            List<Genre> list = genreRepository.findAll();
            map.put("status", 1);
            map.put("message", "성공");
            map.put("list", list);
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }
}
