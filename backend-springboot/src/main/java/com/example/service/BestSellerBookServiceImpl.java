package com.example.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.stereotype.Service;

import com.example.entity.BestSellerBook;
import com.example.entity.Item;
import com.example.entity.ItemBook;
import com.example.repository.BestSellerBookRepository;
import com.example.repository.ItemBookRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BestSellerBookServiceImpl implements BestSellerBookService{

    private final BestSellerBookRepository bestRepo;
    private final ItemBookRepository itemBookRepo;

    @Override
    public void insertBestSeller(Long ino, Integer rank, String note) {
        ItemBook book = itemBookRepo.findById(ino)
            .orElseThrow(() -> new RuntimeException("책 정보 없음"));

        BestSellerBook obj = BestSellerBook.builder()
            .itemBook(book)
            .rank(rank)
            .visible(true)
            .note(note)
            .build();

        bestRepo.save(obj);
    }

    // ✅ 베스트셀러 리스트 조회
   @Override
    public List<Map<String, Object>> getBestSellerList() {
        List<BestSellerBook> list = bestRepo.findTop10ByVisibleTrueOrderByRankAsc();

        return list.stream().map(b -> {
            ItemBook itemBook = b.getItemBook();
            if (itemBook == null) return null;

            Item item = itemBook.getItem();
            if (item == null) return null;

            // 이미지 리스트
            List<String> imgUrlList = item.getItemImgList().stream()
            .map(img -> "/api2/itemimage/image?no=" + img.getNo())
            .toList();

            Map<String, Object> dto = new HashMap<>();
            dto.put("id", b.getId());
            dto.put("rank", b.getRank());
            dto.put("note", b.getNote());
            dto.put("writer", itemBook.getWriter());
            dto.put("title", item.getTitle());
            dto.put("bookprice", itemBook.getBookprice());
            dto.put("imgUrlList", imgUrlList);
            dto.put("itemNo", item.getNo());
            dto.put("discount", item.getDiscount());
            return dto;
        }).filter(Objects::nonNull).toList();
    }

    @Override
    public Map<String, Object> getBestSellerOne(Long no) {
        BestSellerBook b = bestRepo.findById(no)
            .orElseThrow(() -> new RuntimeException("해당 도서를 찾을 수 없습니다."));

        ItemBook itemBook = b.getItemBook();
        if (itemBook == null) return null;

        Item item = itemBook.getItem();
        if (item == null) return null;

        // 이미지 리스트
         List<String> imgUrlList = item.getItemImgList().stream()
            .map(img -> "/api2/itemimage/image?no=" + img.getNo())
            .toList();

        Map<String, Object> dto = new HashMap<>();
        dto.put("id", b.getId());
        dto.put("genrename", b.getItemBook().getGenre().getGenreName());
        dto.put("publisher", b.getItemBook().getPublisher());
        dto.put("rank", b.getRank());
        dto.put("note", b.getNote());
        dto.put("writer", itemBook.getWriter());
        dto.put("title", item.getTitle());
        dto.put("bookprice", itemBook.getBookprice());
        dto.put("imgUrlList", imgUrlList);
        dto.put("itemNo", item.getNo());
        dto.put("explain", item.getExplain());  // 혹시 상세 설명 들어가는 필드
        dto.put("discount", item.getDiscount());
        return dto;
    }
}
