package com.example.restcontroller;

import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.PageRequest;

import com.example.entity.*;
import com.example.projection.ItemImgProjection;
import com.example.repository.GenreRepository;
import com.example.repository.ItemBookRepository;
import com.example.repository.ItemImageRespository;
import com.example.repository.ItemRepository;
import com.example.dto.ItemDTO;
import com.example.service.ItemService;
import com.example.util.TokenComponent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.*;



@RestController
@RequestMapping("/api2/item")
@RequiredArgsConstructor
@Slf4j
public class ItemRestController {

    private final ItemService itemService;
    private final ItemRepository itemRepository;
    private final TokenComponent tComponent;
    private final ItemImageRespository iiRepository;
    private final ItemBookRepository itemBookRepository;
    private final GenreRepository genreRepository;

    // 구매자용 장르별 조회
    // 토큰 없이 조회가능
    // http://127.0.0.1:8080/api2/item/genrelist/buyer?gno=1&page=1&cnt=20
    @GetMapping("/genrelist/buyer")
    public Map<String, Object> selectListBuyer(
        @RequestParam Long gno,
        @RequestParam int page,
        @RequestParam int cnt
    ) {
        Map<String, Object> result = new HashMap<>();
        try {
            PageRequest pageRequest = PageRequest.of(page-1, cnt);

            // 구매자: mno 불필요 -> 전체 판매자 상품에서 genre별 조회
            List<Item> list = itemRepository.findBySaleStatusAndItemBook_Genre_NoOrderByRegdateDesc(
                1, gno, pageRequest
            );

            for(Item obj: list) {
                ItemBook itemBook = itemBookRepository.findById(obj.getNo()).orElse(null);
                if(itemBook != null) {
                    obj.setBookprice(itemBook.getBookprice());
                }
                ItemImgProjection tmp = iiRepository.findByItem_NoAndImgDefault(obj.getNo(), true);
                obj.setDefault_img_url("/api2/itemimage/image?no=0");
                if (tmp != null) {
                    obj.setDefault_img_url("/api2/itemimage/image?no=" + tmp.getNo());
                    obj.setGenreName(itemBook.getGenre().getGenreName());
                    obj.setWriter(itemBook.getWriter());
                }
            }
            Genre genre = genreRepository.findById(gno).orElse(null);
            Long total = itemRepository.countBySaleStatusAndItemBook_Genre_NoOrderByRegdateAsc(1, gno);
            result.put("status", 1);
            result.put("list", list);
            result.put("total", total);
            result.put("genre", genre.getGenreName());
        } catch (Exception e) {
            result.put("status", -1);
            result.put("message", e.getMessage());
        }
        return result;
    }


    // 판매자용 장르별 조회
    // http://127.0.0.1:8080/api2/item/genrelist?gno=1&page=1&cnt=20
    // 판매자의 본인 등록한 상품 조회
    // headers : Authorization Token
    // const url = `api2/item/genrelist?gno=1&page=1&cnt=20`
    // const headers = { Authorization: `Bearer ${token}` }
    // const {data} = await axios.get(url, { headers }, gno);
    @GetMapping("/genrelist")
    public Map<String, Object> selectList(
        @RequestHeader("Authorization") String token,
        @RequestParam Long gno,
        @RequestParam int page,
        @RequestParam int cnt
         ) {
       
        Map<String, Object> result = new HashMap<>();
        try {
            PageRequest pageRequest = PageRequest.of(page-1, cnt);
            
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            List<Item> list = itemRepository.findBySaleStatusAndMember_NoAndItemBook_Genre_NoOrderByRegdateDesc(1, mno, gno, pageRequest);
            for(Item obj: list) {

                System.out.println("AAAA");
                System.out.println(obj.getNo());
                ItemBook itemBook = itemBookRepository.findById(obj.getNo()).orElse(null);
                if(itemBook != null) {
                    obj.setBookprice(itemBook.getBookprice());
                    obj.setWriter(itemBook.getWriter());
                    obj.setGenreName(itemBook.getGenre().getGenreName());
                }
                ItemImgProjection tmp = iiRepository.findByItem_NoAndImgDefault(obj.getNo(), true);
                
               obj.setDefault_img_url("/api2/itemimage/image?no=0");
               if (tmp != null) {
                    obj.setDefault_img_url("/api2/itemimage/image?no=" + tmp.getNo());
               }
               
            }
            Long total = itemRepository.countBySaleStatusAndMember_NoAndItemBook_Genre_NoOrderByRegdateAsc(1, mno, gno);
            result.put("status", 1);
            result.put("list", list);
            result.put("total", total);
        } catch (Exception e) {
            result.put("status", -1);
            result.put("message", e.getMessage());
        }
        return result;
    }



    // 고객용 등록된 상품 열람
    // 구매자용
    // http://127.0.0.1:8080/api2/item/selectitemlist?page=1&cnt=20&text=
    // const url = `/api2/item/selectitemlist?page=1&cnt=20&text=`
    // const {data} = await axios.get( url );
    @GetMapping("/selectitemlist")
    public Map<String, Object> selectItemList(
        @RequestParam int page,
        @RequestParam int cnt,
        @RequestParam String text ) {
        
        Map<String, Object> map = new HashMap<>();
        // 물품 저장소로부터 제목이 포함된 검색기능과 등록된 날짜순 오름차순 정렬 기능, 페이지네이션 기능 추가
        try {
            PageRequest pageRequest = PageRequest.of(page-1, cnt);
            List<Item> list = itemRepository.findBySaleStatusAndTitleContainingOrderByRegdateDesc(1, text, pageRequest);
            for(Item obj: list) {
                System.out.println(obj.getNo());
                ItemBook itemBook = itemBookRepository.findById(obj.getNo()).orElse(null);
                if(itemBook != null) {
                    obj.setBookprice(itemBook.getBookprice());
                    obj.setWriter(itemBook.getWriter());
                    obj.setGenreName(itemBook.getGenre().getGenreName());
                }
                ItemImgProjection tmp = iiRepository.findByItem_NoAndImgDefault(obj.getNo(), true);
                
                obj.setDefault_img_url("/api2/itemimage/image?no=0");
                if (tmp != null) {
                    obj.setDefault_img_url("/api2/itemimage/image?no=" + tmp.getNo());
               }
               
            }
            Long total = itemRepository.countBySaleStatusAndTitleContainingOrderByRegdateAsc(1, text);
            map.put("status", 1);
            map.put("list", list);
            map.put("total", total);
        } catch (Exception e) {
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }
    


    // http://127.0.0.1:8080/api2/item/selectlist?page=1&cnt=20&text=
    // 판매자의 본인 등록한 상품 조회
    // headers : Authorization Token
    @GetMapping("/selectlist")
    public Map<String, Object> selectList(
        @RequestHeader("Authorization") String token,
        @RequestParam int page,
        @RequestParam int cnt,
        @RequestParam String text ) {
       
        Map<String, Object> result = new HashMap<>();
        try {
            PageRequest pageRequest = PageRequest.of(page-1, cnt);
            // 1. 토큰에서 Bearer 제거
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            // 2. 토큰에서 사용자 정보 추출
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            List<Item> list = itemRepository.findBySaleStatusAndMember_NoAndTitleContainingOrderByRegdateDesc(1, mno, text, pageRequest);
            System.out.println("AA");
            System.out.println(list.size());
            for(Item obj: list) {
                ItemBook itemBook = itemBookRepository.findByItem_No(obj.getNo()).orElse(null);
                if(itemBook != null) {
                    obj.setBookprice(itemBook.getBookprice());
                    obj.setDiscount(itemBook.getItem().getDiscount());
                    obj.setWriter(itemBook.getWriter());
                    obj.setGenreName(itemBook.getGenre().getGenreName());
                }
                ItemImgProjection tmp = iiRepository.findByItem_NoAndImgDefault(obj.getNo(), true);
                
               obj.setDefault_img_url("/api2/itemimage/image?no=0");
               if (tmp != null) {
                    obj.setDefault_img_url("/api2/itemimage/image?no=" + tmp.getNo());
               }
               
            }
            Long total = itemRepository.countBySaleStatusAndMember_NoAndTitleContainingOrderByRegdateAsc(1, mno, text);
            result.put("status", 1);
            result.put("list", list);
            result.put("total", total);
        } catch (Exception e) {
            result.put("status", -1);
            result.put("message", e.getMessage());
        }
        return result;
    }

    //  http://127.0.0.1:8080/api2/item/book/update
    // const headers Authorization Bearer Token
    /* 
    const itemData = {
        "title" : "판매 제목2",
        "stock" : 85,
        "explain" : "책설명1",
        "discount" : 5,
        "no" : 5
    }

    const bookData = {
        "book_name" : "책제목2",
        "writer" : "작가명2",
        "book_detail" : "책 내용 간략소개2",
        "publisher" : "출판사2",
        "bookprice" : 10000,
        "genre" : {"no" : 2}
    };

    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(itemData)], { type: 'application/json' }));
    formData.append('book', new Blob([JSON.stringify(bookData)], { type: 'application/json' }));
    */
    @PutMapping(value = "/book/update")
    public Map<String, Object> updateItemMap(
        @RequestHeader("Authorization") String token, 
        @RequestPart(name = "item") Item item,
        @RequestPart(name = "book") ItemBook book) {
        System.out.println(item.toString());
        System.out.println(book.toString());
        Map<String, Object> result = new HashMap<>();
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            Integer seller = Integer.parseInt(userInfo.get("seller").toString());
            Member member = new Member();
            member.setNo(mno);
            item.setMember(member);
            result.put("status", -1);
            result.put("message", "권한이 없습니다.");
            if (seller == 1) {
                itemService.updateBookItem(token, item, book);
                result.put("status", 1);
                result.put("message", "책 변경을 완료하였습니다.");
            }
           return result;
        } catch (Exception e) {
            result.put("status", 0);
            result.put("message", e.getMessage());
        }
        return result;
    }


    // http://127.0.0.1:8080/api2/item/book/insert
    // headers {key: Authorization}, {value : Bearer TOKEN값}

    /* 
    const itemData = {
        "title" : "판매 제목",
        "stock" : 120,
        "explain" : "책설명",
        "discount" : 15,
        "sale_status" : 1
    };

    const bookData = {
        "book_name" : "책제목",
        "writer" : "작가명",
        "book_detail" : "책 내용 간략소개",
        "publisher" : "출판사",
        "bookprice" : 12000,
        "genre" : {"no" : 1}
    };

    const formData = new FormData();
    formData.append('item', new Blob([JSON.stringify(itemData)], { type: 'application/json' }));
    formData.append('book', new Blob([JSON.stringify(bookData)], { type: 'application/json' }));
    */

    @PostMapping("/book/insert")
    public Map<String, Object> insertBook(
       @RequestHeader("Authorization") String token,
        @RequestPart(name = "item") Item item,
        @RequestPart(name = "book") ItemBook book) {
        Map<String, Object> result = new HashMap<>();
        System.out.println(item.getExplain());
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            Integer seller = Integer.parseInt(userInfo.get("seller").toString());
            Member member = new Member();
            member.setNo(mno);
            item.setMember(member);
            result.put("status", -1);
            result.put("message", "권한이 없습니다.");
            if (seller == 1) {
                Long itemNo = itemService.insertBookItem(token, item, book);
                result.put("status", 1);
                result.put("message", "책 등록이 성공하였습니다.");
                result.put("ino", itemNo);
            }
           return result;
        } catch (Exception e) {
            result.put("status", 0);
            result.put("message", e.getMessage());
        }
        return result;
    }

    
    // 127.0.0.1:8080/api2/item/select?no=51
    @GetMapping("/select")
    public Map<String, Object> selectItem(@RequestParam Long no) {
        Map<String, Object> result = new HashMap<>();
        try {
            ItemDTO dto = itemService.getItemDetail(no);
          

            result.put("status", 1);
            result.put("item", dto);
        } catch (Exception e) {
            result.put("status", -1);
            result.put("message", e.getMessage());
        }
        log.info("result: {}", result);
        return result;
    }

    @GetMapping("/user/{userid}")
    public Map<String, Object> getItemsByUserId(@PathVariable String userid) {
        Map<String, Object> result = new HashMap<>();
        try {
            List<ItemDTO> dtoList = itemService.getItemsByUserid(userid);
            result.put("status", 1);
            result.put("items", dtoList);
        } catch (Exception e) {
            result.put("status", -1);
            result.put("message", e.getMessage());
        }
        return result;
    }

   
    // 127.0.0.1:8080/api2/item/delete 삭제시 sell status를 0 으로 변경
    // headers : token 
    // {"no" : 49 }
    @PutMapping("/delete")
    public  Map<String, Object> deleteItem(
        @RequestHeader("Authorization") String token, 
        @RequestBody Item no) {
         Map<String, Object> map = new HashMap<>();
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            Map<String, Object> userInfo = tComponent.validate(token);
            Long mno = Long.parseLong(userInfo.get("mno").toString());
            Item item = itemRepository.findByNoAndMember_No(no.getNo(), mno);
            map.put("status", 0);
            map.put("message", "삭제를 실패했습니다.");
            if(item != null) {
                item.setSaleStatus(0);
                itemRepository.save(item);
                map.put("status", 1);
                map.put("message", "삭제를 성공했습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            map.put("status", -1);
            map.put("message", e.getMessage());
        }
        return map;
    }

    // 검색 기능
    // 127.0.0.1:8080/api2/item/search?type=title&keyword=알고리즘&page=1&cnt=20
    @GetMapping("/search")
    public Map<String, Object> searchItemsForBuyer(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "12") int cnt,
        @RequestParam String type,
        @RequestParam(required = false) String keyword
    ) {
        return itemService.searchItemsForBuyer(page, cnt, type, keyword);
    }


}
