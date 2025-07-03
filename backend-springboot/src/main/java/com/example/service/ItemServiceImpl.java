package com.example.service;



import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.dto.ItemDTO;
import com.example.entity.Item;
import com.example.entity.ItemBook;
import com.example.entity.Member;
import com.example.repository.InverterRepository;
import com.example.repository.ItemBookRepository;
import com.example.repository.ItemRepository;
import com.example.repository.ItemToolRepository;
import com.example.repository.MemberRepository;
import com.example.repository.ToolRepository;
import com.example.util.TokenComponent;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository iRepository;
    private final ItemToolRepository itRepository;
    private final ToolRepository tRepository;
    private final InverterRepository ivRepository;
    private final ItemBookRepository ibRepository;
    private final TokenComponent tComponent;
    private final MemberRepository mRepository;

    @Override
    @Transactional
    public void updateBookItem(String token, Item item, ItemBook itemBook) {
        // ✅ 토큰 검증 및 userid 추출
        Map<String, Object> userInfo = tComponent.validate(token);
        String userid = userInfo.get("userid").toString();

        // ✅ 회원 조회
        Member member = mRepository.findByUserid(userid);
        if (member == null) {
            throw new RuntimeException("회원 정보를 찾을 수 없습니다.");
        }



        // ✅ 아이템 조회
        Item item2 = iRepository.findByNo(item.getNo()).orElseThrow(() -> new RuntimeException("Item not found")); // 꺼낸 내용

        // ✅ 아이템 수정
        item2.setDiscount(item.getDiscount());
        item2.setExplain(item.getExplain());
        item2.setStock(item.getStock());
        item2.setTitle(item.getTitle());

        iRepository.save(item2);

        // ✅ 책 조회
        ItemBook itemBook2 = ibRepository.findByItem_No(item.getNo()).orElseThrow(() -> new RuntimeException("Item not found")); // 꺼낸 내용
        
        // ✅ 책 수정
        itemBook2.setBookDetail(itemBook.getBookDetail());
        itemBook2.setBookName(itemBook.getBookName());
        itemBook2.setBookprice(itemBook.getBookprice());
        itemBook2.setGenre(itemBook.getGenre());
        itemBook2.setPublisher(itemBook.getPublisher());
        itemBook2.setWriter(itemBook.getWriter());

        ibRepository.save(itemBook2);
        
    }


    @Override
    @Transactional
    public Long insertBookItem(String token, Item item, ItemBook book) {
                // ✅ 토큰 검증 및 userid, Seller 값 추출
        Map<String, Object> userInfo = tComponent.validate(token);
        String userid = userInfo.get("userid").toString();
        int seller = (int) userInfo.get("seller");

        // ✅ 판매 권한(Seller=1) 확인
        if (seller != 1) {
            throw new RuntimeException("판매 권한 없음: 판매자만 등록할 수 있습니다.");
        }

        // ✅ 회원 조회
        Member member = mRepository.findByUserid(userid);
        if (member == null) {
            throw new RuntimeException("회원 정보를 찾을 수 없습니다.");
        }
        System.out.println(item.toString());
        Item savedItem/* 2 */ = iRepository.save(item); //1
        iRepository.flush();
        
        book.setItem(savedItem); // 3
        ibRepository.save(book); // 4
        ibRepository.flush();

        return savedItem.getNo();
    }

   @Override
    public void deleteItem(String token, Long no) {
        Map<String, Object> userInfo = tComponent.validate(token);
        String userid = userInfo.get("userid").toString();
        Member member = mRepository.findByUserid(userid);

        // 삭제할 아이템 조회
        Item item = iRepository.findById(no)
            .orElseThrow(() -> new RuntimeException("Item not found"));

        // 현재 사용자가 아이템의 소유자인지 확인
        if (!item.getMember().getNo().equals(member.getNo())) {
            throw new RuntimeException("권한 없음: 본인의 아이템만 삭제할 수 있습니다.");
        }

        // 실제 삭제
        itRepository.findById(no).ifPresent(it -> {
            Optional.ofNullable(it.getTool()).ifPresent(tool -> tRepository.deleteById(tool.getIno()));
            Optional.ofNullable(it.getInverter()).ifPresent(inv -> ivRepository.deleteById(inv.getIno()));
            itRepository.delete(it);
        });

        ibRepository.findById(no).ifPresent(ibRepository::delete);
        iRepository.deleteById(no);
    }

    @Override
    public ItemDTO getItemDetail(Long itemId) {
        Item item = iRepository.findById(itemId).orElseThrow(() -> new RuntimeException("Item not found"));
        System.out.println(item.getItemBook().getGenre().getNo());
        return new ItemDTO(item);
    }

    @Override
    public List<ItemDTO> getItemsByUserid(String userid) {
        return iRepository.findByMember_UseridOrderByRegdateDesc(userid)
                .stream()
                .map(ItemDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> searchItemsForBuyer(int page, int cnt, String type, String keyword) {
        Map<String, Object> result = new HashMap<>();
        try {
            Pageable pageable = PageRequest.of(page - 1, cnt);
            List<Item> list = new ArrayList<>();
            Long total = 0L;
            int saleStatus = 1; // 판매중 상품만

            switch (type) {
                case "title":
                    list = iRepository.findBySaleStatusAndTitleContainingOrderByRegdateDesc(saleStatus, keyword, pageable);
                    total = iRepository.countBySaleStatusAndTitleContainingOrderByRegdateAsc(saleStatus, keyword);
                    break;
                case "writer":
                    list = iRepository.findBySaleStatusAndItemBook_WriterContainingOrderByRegdateDesc(saleStatus, keyword, pageable);
                    total = iRepository.countBySaleStatusAndItemBook_WriterContainingOrderByRegdateAsc(saleStatus, keyword);
                    break;
                case "detail":
                    list = iRepository.findBySaleStatusAndExplainContainingOrderByRegdateDesc(saleStatus, keyword, pageable);
                    total = iRepository.countBySaleStatusAndExplainContainingOrderByRegdateAsc(saleStatus, keyword);
                    break;
                case "genre":
                    list = iRepository.findBySaleStatusAndItemBook_Genre_GenreNameContainingOrderByRegdateDesc(saleStatus, keyword, pageable);
                    total = iRepository.countBySaleStatusAndItemBook_Genre_GenreNameContaining(saleStatus, keyword); // ✅ 장르 이름 기준으로 수정
                    break;
                default:
                    throw new IllegalArgumentException("검색 타입이 잘못되었습니다: " + type);
            }

            // ✅ 변환
            List<ItemDTO> dtoList = list.stream()
                .map(ItemDTO::new)
                .collect(Collectors.toList());

            result.put("status", 1);
            result.put("list", dtoList);
            result.put("total", total);
            

        } catch (Exception e) {
            result.put("status", -1);
            result.put("message", e.getMessage());
        }

        return result;
    }
}