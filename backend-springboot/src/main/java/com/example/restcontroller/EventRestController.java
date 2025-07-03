package com.example.restcontroller;


  
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.PageRequest;
  
import com.example.entity.*;
import com.example.repository.EventRepository;
import com.example.repository.ItemRepository;

import com.example.util.TokenComponent;
    
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
  
  

@RestController
@RequestMapping("/api2/event")
@RequiredArgsConstructor
@Slf4j
public class EventRestController {
  // 이벤트(할인 등...)



      final com.example.service.ItemService ItemService;
      final EventRepository eventRepository;
      final ItemRepository itemRepository;
      final TokenComponent tComponent;
  
      //고객용용 등록된 상품 열람
      // http://127.0.0.1:8080/api2/event/selecteventlist?page=1&cnt=20&text=
@GetMapping("/selecteventlist")
public Map<String, Object> selectAllEventList(
        @RequestParam int page,
        @RequestParam int cnt,
        @RequestParam(required = false) String text) { // 검색어를 선택적으로 받음

    Map<String, Object> map = new HashMap<>();
    try {
        PageRequest pageRequest = PageRequest.of(page - 1, cnt);

        List<Event> list;
        if (text != null && !text.isEmpty()) {
            // 검색어가 존재하면 해당 검색 기능 유지
            list = eventRepository.findByTitleContainingOrderByRegdateAsc(text, pageRequest);
        } else {
            // 검색어가 없으면 모든 이벤트 반환
            list = eventRepository.findAllByOrderByRegdateAsc(pageRequest);
        }
        
        // 각 이벤트별로 종료 시간 계산 및 상태 추가
        List<Map<String, Object>> enhancedList = new ArrayList<>();
        for (Event event : list) {
            Map<String, Object> eventMap = new HashMap<>();
            
            eventMap.put("no", event.getNo());
            eventMap.put("title", event.getTitle());
            eventMap.put("context", event.getContext());
            eventMap.put("dday", event.getDday());
            eventMap.put("event_discount", event.getEvent_discount());
            eventMap.put("regdate", event.getRegdate());
            
            // regdate는 java.util.Date 형태이므로 LocalDateTime으로 변환
            LocalDateTime regdateLdt = event.getRegdate()
                    .toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();
            
            // dday 값(문자열)을 정수로 파싱. 파싱에 실패하면 0일로 처리
            int ddayDays = 0;
            try {
                ddayDays = Integer.parseInt(event.getDday());
            } catch (NumberFormatException nfe) {
                // ddayDays remains 0 if parsing fails.
            }
            // 등록일에 dday일을 더해 종료 시점을 계산
            LocalDateTime computedEndDate = regdateLdt.plusDays(ddayDays);
            eventMap.put("calculatedEndDate", computedEndDate.toString());
            
            // 현재 시간과 비교하여 이벤트 종료 여부 판별
            String eventStatus = LocalDateTime.now().isAfter(computedEndDate) ? "종료" : "진행중";
            eventMap.put("eventStatus", eventStatus);
            
            enhancedList.add(eventMap);
        }
        
        map.put("status", 1);
        map.put("list", enhancedList);
    } catch (Exception e) {
        map.put("status", -1);
        map.put("message", e.getMessage());
    }
    return map;
}


      
  
  
      // http://127.0.0.1:8080/api2/event/selectsellerlist?page=1&cnt=20&text=
      // 판매자의 본인 등록한 상품 조회
      // headers : Authorization Token
@GetMapping("/selectsellerlist")
public Map<String, Object> selectEventList(
    @RequestHeader("Authorization") String token,
    @RequestParam int page,
    @RequestParam int cnt,
    @RequestParam String text) {

    Map<String, Object> result = new HashMap<>();
    try {
        PageRequest pageRequest = PageRequest.of(page - 1, cnt);

        // 1. 토큰에서 Bearer 제거
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // 2. 토큰에서 판매자 정보 추출
        Map<String, Object> userInfo = tComponent.validate(token);
        Long mno = Long.parseLong(userInfo.get("mno").toString());

        // 3. 본인이 등록한 이벤트 조회 (text 파라미터는 필요 시 추가적인 필터링에 활용할 수 있음)
        List<Event> eventList = eventRepository.findByMember_No(mno, pageRequest);

        // 4. 각 이벤트별 종료 시점과 상태 계산
        List<Map<String, Object>> enhancedList = new ArrayList<>();
        for (Event event : eventList) {
            Map<String, Object> eventMap = new HashMap<>();
            eventMap.put("no", event.getNo());
            eventMap.put("title", event.getTitle());
            eventMap.put("context", event.getContext());
            eventMap.put("dday", event.getDday());
            eventMap.put("event_discount", event.getEvent_discount());
            eventMap.put("regdate", event.getRegdate());
            
            // regdate는 java.util.Date 타입이므로 LocalDateTime으로 변환
            LocalDateTime regdateLdt = event.getRegdate()
                    .toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDateTime();
            
            int ddayDays = 0;
            try {
                ddayDays = Integer.parseInt(event.getDday());
            } catch (NumberFormatException e) {
                // 파싱 실패 시 기본값 0일 처리
                ddayDays = 0;
            }
            // 등록일에 dday일을 더하여 종료 시점 계산
            LocalDateTime computedEndDate = regdateLdt.plusDays(ddayDays);
            eventMap.put("calculatedEndDate", computedEndDate.toString());
            
            // 현재 시간과 비교하여 종료 여부 판단
            String eventStatus = LocalDateTime.now().isAfter(computedEndDate) ? "종료" : "진행중";
            eventMap.put("eventStatus", eventStatus);

            enhancedList.add(eventMap);
        }

        result.put("status", 1);
        result.put("list", enhancedList);
    } catch (Exception e) {
        result.put("status", -1);
        result.put("message", e.getMessage());
    }
    return result;
}

  

  
      // http://127.0.0.1:8080/api2/event/insert
      // headers {key: Authorization}, {value : Bearer TOKEN값}
  
      /* 
     
    {
      "title": "여름 할인 이벤트",
      "context": "올여름 최고의 할인 혜택을 만나보세요!",
      "dday": "8",
      "event_discount": 20,
      "item": {
        "no": 123
      }
    }

  
      const formData = new FormData();
      formData.append('event', new Blob([JSON.stringify(eventData)], { type: 'application/json' }));
      formData.append('book', new Blob([JSON.stringify(bookData)], { type: 'application/json' }));
      */
  
@PostMapping("/insert")
public Map<String, Object> insertEvent(
    @RequestHeader("Authorization") String token,
    @RequestBody Event event) { 

    Map<String, Object> result = new HashMap<>();
    try {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        Map<String, Object> userInfo = tComponent.validate(token);
        Long mno = Long.parseLong(userInfo.get("mno").toString());
        Integer seller = Integer.parseInt(userInfo.get("seller").toString());

        if (seller != 1) {
            result.put("status", -1);
            result.put("message", "권한이 없습니다.");
            return result;
        }

        Long ino = event.getItem().getNo();  
        Optional<Item> itemOpt = itemRepository.findById(ino);
        if (!itemOpt.isPresent()) {
            result.put("status", -1);
            result.put("message", "해당 아이템을 찾을 수 없습니다.");
            return result;
        }

        Item item = itemOpt.get();
        if (!item.getMember().getNo().equals(mno)) {
            result.put("status", -1);
            result.put("message", "해당 아이템을 등록한 판매자가 아닙니다.");
            return result;
        }


        event.setMember(item.getMember());
        event.setItem(item);

        eventRepository.save(event);

        result.put("status", 1);
        result.put("message", "이벤트 등록이 성공적으로 완료되었습니다.");
        result.put("eventNo", event.getNo());

    } catch (Exception e) {
        result.put("status", 0);
        result.put("message", e.getMessage());
    }
    return result;
}

  
      
     
           // http://127.0.0.1:8080/api2/event/delete/{eventId}
      // headers {key: Authorization}, {value : Bearer TOKEN값}
  
  
@DeleteMapping("/delete/{eventId}")
public Map<String, Object> deleteevent(
        @RequestHeader(name = "Authorization") String token,
        @PathVariable Long eventId) {

    Map<String, Object> result = new HashMap<>();
    try {
        // 토큰에서 "Bearer " 접두어 제거
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        // 토큰을 통해 사용자 정보 추출
        Map<String, Object> userInfo = tComponent.validate(token);
        Long mno = Long.parseLong(userInfo.get("mno").toString());
        
        // 이벤트 정보 조회
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (!eventOpt.isPresent()) {
            result.put("status", -1);
            result.put("message", "이벤트가 존재하지 않습니다.");
            return result;
        }

        Event event = eventOpt.get();
        
        // 해당 이벤트가 본인이 등록한 이벤트인지 확인
        if (!event.getMember().getNo().equals(mno)) {
            result.put("status", -1);
            result.put("message", "삭제 권한이 없습니다.");
            return result;
        }

        // 권한이 확인되었으므로 이벤트 삭제
        eventRepository.delete(event);
        result.put("status", 1);
    } catch (Exception e) {
        e.printStackTrace();
        result.put("status", -1);
        result.put("message", e.getMessage());
    }
    return result;
}
  
  }
  

