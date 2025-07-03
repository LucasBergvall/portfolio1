package com.example.service;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.entity.*;
import com.example.repository.*;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MdRecommendServiceImpl implements MdRecommendService {

    private final RecommendBookRepository recommendBookRepository;
    private final RecommendGroupRepository recommendGroupRepository;
    private final ItemRepository itemRepository;
    private final ItemImageRespository itemImgRepository;
    private final GenreRepository genreRepository;

    @Override
    public List<Map<String, Object>> getRecommendBookList(String groupName) {
        RecommendGroup group = recommendGroupRepository.findByGroupName(groupName);
        if (group == null) throw new RuntimeException("그룹 없음");

        List<RecommendBook> list = recommendBookRepository.findByGroupOrderBySortOrderAsc(group);
        List<Long> itemNos = list.stream().map(rb -> rb.getItem().getNo()).collect(Collectors.toList());
        List<ItemImg> images = itemImgRepository.findByItemNos(itemNos);
        Map<Long, List<ItemImg>> imageMap = images.stream().collect(Collectors.groupingBy(img -> img.getItem().getNo()));

        return list.stream().map(rb -> {
            Map<String, Object> map = new HashMap<>();
            Item item = rb.getItem();
            ItemBook book = item.getItemBook();

            map.put("id", rb.getId());
            map.put("itemNo", item.getNo());
            map.put("title", book != null ? book.getBookName() : "");
            map.put("writer", book != null ? book.getWriter() : "");
            map.put("publisher", book != null ? book.getPublisher() : "");
            map.put("bookprice", book != null ? book.getBookprice() : 0);
            map.put("discount", item.getDiscount());
            map.put("defaultimg", book != null ? book.getDefaultImg() : "");

            List<String> imgUrls = Optional.ofNullable(imageMap.get(item.getNo()))
                    .orElse(Collections.emptyList())
                    .stream()
                    .map(img -> "/api2/itemimage/image?no=" + img.getNo())
                    .collect(Collectors.toList());
            map.put("imgUrlList", imgUrls);
            return map;
        }).collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getRecommendBookOne(Long recommendId) {
        RecommendBook rb = recommendBookRepository.findById(recommendId)
                .orElseThrow(() -> new RuntimeException("추천 도서 없음"));
        Item item = rb.getItem();
        ItemBook book = item.getItemBook();

        Map<String, Object> map = new HashMap<>();
        map.put("id", rb.getId());
        map.put("itemNo", item.getNo());
        map.put("title", book != null ? book.getBookName() : "");
        map.put("writer", book != null ? book.getWriter() : "");
        map.put("publisher", book != null ? book.getPublisher() : "");
        map.put("bookprice", book != null ? book.getBookprice() : 0);
        map.put("discount", item.getDiscount());
        map.put("defaultimg", book != null ? book.getDefaultImg() : "");
        map.put("explain", book != null ? book.getBookDetail() : "");

        if (book != null) {
            Genre genre = genreRepository.findById(book.getGenre().getNo()).orElse(null);
            map.put("genrename", genre != null ? genre.getGenreName() : "");
        } else {
            map.put("genrename", "");
        }

        List<String> imgUrls = itemImgRepository.findByItem_No(item.getNo())
                .stream()
                .map(img -> "/api2/itemimage/image?no=" + img.getNo())
                .collect(Collectors.toList());
        map.put("imgUrlList", imgUrls);
        return map;
    }

    @Override
    @Transactional
    public void insertRecommendBook(String groupName, Long itemNo, int sortOrder) {
        RecommendGroup group = recommendGroupRepository.findByGroupName(groupName);
        if (group == null) throw new RuntimeException("해당 그룹 없음");
        Item item = itemRepository.findById(itemNo).orElseThrow(() -> new RuntimeException("아이템 없음"));

        RecommendBook rb = new RecommendBook();
        rb.setGroup(group);
        rb.setItem(item);
        rb.setSortOrder(sortOrder);
        recommendBookRepository.save(rb);
    }

    @Override
    @Transactional
    public void updateSortOrder(Long recommendId, int sortOrder) {
        RecommendBook rb = recommendBookRepository.findById(recommendId)
                .orElseThrow(() -> new RuntimeException("추천도서 없음"));
        rb.setSortOrder(sortOrder);
        recommendBookRepository.save(rb);
    }
}
