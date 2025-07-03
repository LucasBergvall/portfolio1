package com.example.service;

import java.util.List;
import java.util.Map;

import com.example.dto.ItemDTO;
import com.example.entity.Item;
import com.example.entity.ItemBook;

public interface ItemService {
    Long insertBookItem(String token,Item item, ItemBook book);
    void updateBookItem(String token, Item item, ItemBook itemBook);
    void deleteItem(String token,Long no);
    ItemDTO getItemDetail(Long no);
    List<ItemDTO> getItemsByUserid(String token);
    Map<String, Object> searchItemsForBuyer(int page, int cnt, String type, String keyword);
}
