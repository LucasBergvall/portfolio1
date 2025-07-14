package com.example.restcontroller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import com.example.component.MqttPublisher;
import com.example.entity.Member;
import com.example.entity.MessageReport;
import com.example.entity.Order;
import com.example.entity.PaymentHistoryAction;
import com.example.repository.MessageReportRepository;
import com.example.repository.OrderRepository;
import com.example.repository.PaymentHistoryActionRepository;
import com.example.util.TokenComponent;

import lombok.RequiredArgsConstructor;




@RestController
@RequiredArgsConstructor
@RequestMapping("/api2/message")
public class MessageReportRestController {

    private final MessageReportRepository messageReportRepository;
    private final PaymentHistoryActionRepository phaRepository;
    private final TokenComponent tokenComponent;
    private final OrderRepository orderRepository;
    private final MqttPublisher mqttPublisher;

    @PostMapping("/send-by-order")
    public Map<String, Object> sendMessageByOrder(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> param) {
        System.out.println(param.toString());
        Map<String, Object> result = new HashMap<>();
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            Map<String, Object> userInfo = tokenComponent.validate(token);
            Long senderMno = Long.parseLong(userInfo.get("mno").toString());

            Long orderNo = Long.parseLong(param.get("orderNo").toString());
            String content = param.get("content").toString();

            // ✅ orderNo로 Order 엔티티 조회 후 그에 연결된 pha를 가져옴
            Order order = orderRepository.findById(orderNo)
                    .orElseThrow(() -> new RuntimeException("주문이 존재하지 않습니다."));

            PaymentHistoryAction pha = phaRepository.findByOrder_No(orderNo)
                    .orElseThrow(() -> new RuntimeException("결제 기록이 존재하지 않습니다."));

            Member buyer = order.getMember();
            Member seller = order.getItem().getMember();
            order.getMember().getNickname();

            Long buyerNo = buyer.getNo();
            Long sellerNo = seller.getNo();

            Member sender, receiver;
            String senderType;
            int type = 0;
            if (senderMno.equals(buyerNo)) {
                type = 1;
                sender = buyer;
                receiver = seller;
                senderType = "BUYER";
            } else if (senderMno.equals(sellerNo)) {
                type = 2;
                sender = seller;
                receiver = buyer;
                senderType = "SELLER";
            } else {
                result.put("status", 0);
                result.put("message", "이 주문에 대한 권한이 없습니다.");
                return result;
            }

            MessageReport msg = new MessageReport();
            msg.setSender(sender);
            msg.setReceiver(receiver);
            msg.setPaymentHistoryAction(pha); // ✅ 해당 결제 행위와 연결
            msg.setContent(content);
            msg.setSenderType(senderType);

            MessageReport messageReport = messageReportRepository.save(msg);
            
            
            String payload = "{\"data\": " + messageReport.getNo() + ", \"type\": " + type + " }";
            mqttPublisher.publish("chat/order/"+pha.getOrder().getNo(), payload);

            result.put("status", 1);
            result.put("messageReport", messageReport);

        } catch (Exception e) {
            result.put("status", -1);
            result.put("message", e.getMessage());
        }

        return result;
    }

    @GetMapping("/receive-by-order")
    public Map<String, Object> receiveMessageByOrder(
            @RequestHeader("Authorization") String token,
            @RequestParam Long orderNo,
            @RequestParam int page,
            @RequestParam int cnt) {
        Map<String, Object> result = new HashMap<>();

        try {
            PageRequest pageRequest = PageRequest.of(page - 1, cnt);

            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            Map<String, Object> userInfo = tokenComponent.validate(token);
            Long myMno = Long.parseLong(userInfo.get("mno").toString());
            Integer buyer = Integer.parseInt(userInfo.get("buyer").toString());
            Integer seller = Integer.parseInt(userInfo.get("seller").toString());

            result.put("status", 0);
            result.put("messages", "주문한 물품이 아닙니다.");
            if ((buyer == 1 && orderRepository.existsByNoAndMember_No(orderNo, myMno))
                    || (seller == 1 && orderRepository.existsByNoAndItem_Member_No(orderNo, myMno))) {
                // 메시지 조회
                List<MessageReport> list = messageReportRepository
                        .findByPaymentHistoryAction_Order_NoOrderBySendTimeDesc(orderNo, pageRequest);
                result.put("status", 1);
                result.put("messages", list);
            }
            System.out.println("=== receiveMessageByOrder 진입 ===");
            System.out.println("orderNo: " + orderNo);
            System.out.println("page: " + page + ", cnt: " + cnt);
            System.out.println("내 mno: " + myMno + ", buyer: " + buyer + ", seller: " + seller);
            System.out.println("isBuyer: " + orderRepository.existsByNoAndMember_No(orderNo, myMno));
            System.out.println("isSeller: " + orderRepository.existsByNoAndItem_Member_No(orderNo, myMno));

        } catch (Exception e) {
            result.put("status", -1);
            result.put("message", e.getMessage());
        }

        return result;
    }

    @GetMapping("/receive-by-orderone")
    public Map<String, Object> receiveMessageByOrderOne(
        @RequestHeader("Authorization") String token,
        @RequestParam Long messageNo) {
        Map<String, Object> result = new HashMap<>();

        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            Map<String, Object> userInfo = tokenComponent.validate(token);
            Long myMno = Long.parseLong(userInfo.get("mno").toString());
            Integer seller = Integer.parseInt(userInfo.get("seller").toString());
            Integer buyer = Integer.parseInt(userInfo.get("buyer").toString());
            System.out.println(messageNo);
            System.out.println("buyer : " + buyer);
            System.out.println("seller : " + seller);

            MessageReport messageReport = messageReportRepository.findMessageForUser(messageNo, myMno).orElse(null);
            
            result.put("status", 0);
            if(messageReport != null) {
                if(seller == 1) {
                    // 새로운 채팅이 들어올때 자동으로 seller_read를 읽은것으로 처리
                    messageReportRepository.updateSellerReadByNo(messageReport.getNo());
                } else if(buyer == 1) {
                    messageReportRepository.updateBuyerReadByNo(messageReport.getNo());
                }
                result.put("status", 1);
                result.put("messages", messageReport);
            }
        } catch (Exception e) {
            result.put("status", -1);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PutMapping("/change-isreadone")
    public Map<String, Object> changeIsReadone(
        @RequestHeader("Authorization") String token,
        @RequestParam Long messageNo) {
        Map<String, Object> result = new HashMap<>();

        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            Map<String, Object> userInfo = tokenComponent.validate(token);
            Long myMno = Long.parseLong(userInfo.get("mno").toString());
            Integer seller = Integer.parseInt(userInfo.get("seller").toString());
            System.out.println(messageNo);
            result.put("status", 0);
            result.put("message", "is_read를 변경하지 못했습니다..");
            if(seller == 1) {
                MessageReport messageReport = messageReportRepository.findMessageForUser(messageNo, myMno).orElse(null);
                
                if(messageReport != null) {
                    messageReport.setSellerRead(true);
                    messageReportRepository.save(messageReport);

                    result.put("status", 1);
                    result.put("message", "is_read를 변경 했습니다.");
                }
            }    
          
           
        } catch (Exception e) {
            result.put("status", -1);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @PutMapping("/change-sellerread")
    public Map<String, Object> changeSellerRead(
        @RequestHeader("Authorization") String token,
        @RequestParam Long phaNo) {
        Map<String, Object> result = new HashMap<>();
        System.out.println(token);
        System.out.println(phaNo);

        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            Map<String, Object> userInfo = tokenComponent.validate(token);
            Long myMno = Long.parseLong(userInfo.get("mno").toString());
            Integer seller = Integer.parseInt(userInfo.get("seller").toString());

            result.put("status", 0);
            result.put("message", "seller_read변경 실패");

            if(seller == 1) {
                // messagereport번호를 찾아서 가장 아래에 있는 채팅의 messagereport번호랑 같거나 작으면 전부 읽음으로 표시
                messageReportRepository.updateSellerRead(phaNo, myMno);
                result.put("status", 1);
                result.put("message", "seller_read를 변경 했습니다.");
            }
        } catch (Exception e) {
            result.put("status", -1);
            result.put("message", e.getMessage());
        }
        
        return result;
    }

    @PutMapping("/change-buyerread")
    public Map<String, Object> changeBuyerRead(
        @RequestHeader("Authorization") String token,
        @RequestParam Long phaNo) {
        Map<String, Object> result = new HashMap<>();
        System.out.println(token);
        System.out.println(phaNo);

        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            Map<String, Object> userInfo = tokenComponent.validate(token);
            Long myMno = Long.parseLong(userInfo.get("mno").toString());
            Integer buyer = Integer.parseInt(userInfo.get("buyer").toString());

            result.put("status", 0);
            result.put("message", "buyer_read변경 실패");

            if(buyer == 1) {
                // messagereport번호를 찾아서 가장 아래에 있는 채팅의 messagereport번호랑 같거나 작으면 전부 읽음으로 표시
                messageReportRepository.updateBuyerRead(phaNo, myMno);
                result.put("status", 1);
                result.put("message", "buyer_read를 변경 했습니다.");
            }
        } catch (Exception e) {
            result.put("status", -1);
            result.put("message", e.getMessage());
        }
        
        return result;
    }

    @GetMapping("/count-unread")
     public Map<String, Object> countMessage(
        @RequestHeader("Authorization") String token,
        @RequestParam Long orderNo
     ){
        Map<String, Object> result = new HashMap<>();

        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            Map<String, Object> userInfo = tokenComponent.validate(token);
            Long myMno = Long.parseLong(userInfo.get("mno").toString());
            Integer seller = Integer.parseInt(userInfo.get("seller").toString());

            result.put("status", 0);
            result.put("message", "count 실패");
            if(seller == 1) {
                PaymentHistoryAction paymentHistoryAction = phaRepository.findByOrder_No(orderNo).orElse(null);
                Long count = messageReportRepository.countUnreadSellerMessages(paymentHistoryAction.getNo(), myMno);
                result.put("status", 1);
                result.put("count", count);
                result.put("message", "count완료");
            }
            
        } catch (Exception e) {
            result.put("status", -1);
            result.put("message", e.getMessage());
        }
        return result;
    }

    @GetMapping("/count-buyer-unread")
     public Map<String, Object> countBuyerMessage(
        @RequestHeader("Authorization") String token,
        @RequestParam Long orderNo
     ){
        Map<String, Object> result = new HashMap<>();

        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            Map<String, Object> userInfo = tokenComponent.validate(token);
            Long myMno = Long.parseLong(userInfo.get("mno").toString());
            Integer buyer = Integer.parseInt(userInfo.get("buyer").toString());

            result.put("status", 0);
            result.put("message", "count 실패");
            if(buyer == 1) {
                PaymentHistoryAction paymentHistoryAction = phaRepository.findByOrder_No(orderNo).orElse(null);
                Long count = messageReportRepository.countUnreadBuyerMessages(paymentHistoryAction.getNo(), myMno);
                result.put("status", 1);
                result.put("count", count);
                result.put("message", "count완료");
            }
            
        } catch (Exception e) {
            result.put("status", -1);
            result.put("message", e.getMessage());
        }
        return result;
    }
    
    
}
