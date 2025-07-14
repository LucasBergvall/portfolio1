// src/components/InquiryChat.js
import React, { useEffect, useState, useRef } from 'react';
import { Input, Button, List, Avatar, Typography } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import mqtt from 'mqtt';
import { useSelector } from 'react-redux';
import './css/InquiryChat.css';
import dayjs from 'dayjs';

function formatDateSeparator(dateStr) {
  const day = dayjs(dateStr);
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][day.day()];
  return `${day.year()}년 ${day.month() + 1}월 ${day.date()}일 ${dayOfWeek}요일`;
}

const { Text } = Typography;

export default function InquiryChat({ onClose, orderNo }) {
  // 1. 변수
  const messagesListRef = useRef(null);
  const { token } = useSelector(state => state.LoginReducer);
  const [mqttClient, setMqttClient] = useState(null);
  const [historyMessages, setHistoryMessages] = useState([]);     // 과거 메시지
  const [realtimeMessages, setRealtimeMessages] = useState([]);   // 실시간 메시지
  const [input, setInput] = useState('');
  console.log(orderNo);
  const [page, setPage] = useState(1);
  const cnt = 20;
  const chatContentRef = useRef();
  const isAtBottomRef = useRef(true);
  const [isLoading, setIsLoading] = useState(false); // 중복 호출 방지
  const pageRef = useRef(1);
  const [isAtTop, setIsAtTop] = useState(false);
  const hasMoreRef = useRef(true); // ⭐ 추가
  

  // 2. 이펙트
  // MQTT 연결
  useEffect(() => {
    const client = mqtt.connect('ws://175.126.37.21:11884', {
      clean: true,
      reconnectPeriod: 2000,
      clientId: 'chat_' + new Date().getTime(),
      username: 'aaa',
      password: 'bbb'
    });

    
    client.on('connect', () => {
      console.log('MQTT 연결됨 (chat)');
      client.subscribe(`chat/order/${orderNo}`, (err) => {
        if (err) console.error('구독 실패', err);
        else console.log('구독 성공');
      });
    });

    client.on('message', (topic, payload) => {
      const msg = JSON.parse(payload.toString());
      console.log(topic);
      console.log('받은 메시지:', msg);
      handleLoad(msg.data, msg.type);
    });

    setMqttClient(client);
    return () => client.end();
  }, []);
  
  // 초기 메시지 불러오기
  useEffect(() => {
    loadPrevMessages(); // 첫 페이지 로딩
  }, []);

  // 스크롤 상단 도달 시 이전 메시지 불러오기
  useEffect(() => {
    const div = chatContentRef.current;
    if (!div) return;

    const handleScroll = () => {
    const top = div.scrollTop;

    // 맨 위에 도달했을 때 한 번만 load 호출
    if (top <= 10 && !isAtTop) {
      setIsAtTop(true);
      loadPrevMessages();
    }

    // 아래로 조금이라도 내리면 다시 false로 설정
    if (top > 10 && isAtTop) {
      setIsAtTop(false);
    }
  };

    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, []);

  // 현재 위치 감지
  useEffect(() => {
    const chatDiv = chatContentRef.current;
    if (!chatDiv) return;

    const handleScroll = () => {
      const threshold = 100; // 아래로부터 100px 이내면 "맨 아래"로 간주
      const isAtBottom = chatDiv.scrollHeight - chatDiv.scrollTop - chatDiv.clientHeight < threshold;
      isAtBottomRef.current = isAtBottom;
    };

    chatDiv.addEventListener('scroll', handleScroll);
    return () => chatDiv.removeEventListener('scroll', handleScroll);
  }, []);

  const mergeMessages = (prev, next) => {
    const combined = [...prev, ...next];
    const map = new Map();
    combined.forEach(msg => {
      // console.log(msg);
      const key = `${msg.text}-${msg.time}`;
      if (!map.has(key)) map.set(key, msg);
    });
    return Array.from(map.values()).sort((a, b) => new Date(a.time) - new Date(b.time));
  };

  // 렌더링용 전체 메시지
  const allMessages = mergeMessages(historyMessages, realtimeMessages);

  // 새 메시지 도착 시 하단 자동 스크롤
  useEffect(() => {
    if (isAtBottomRef.current && messagesListRef.current) {
      messagesListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allMessages]);

  // 3. 함수
  // 메시지 전송
  const handleSend = async () => {
    if (!input.trim()) return;

    // const newMessage = { id: messages.length + 1, sender: 'user', text: input };

    try {
      // 2. DB 저장 요청
      const headers = { Authorization: `Bearer ${token}` };
      const {data} = await axios.post(`/api2/message/send-by-order`, {orderNo, content: input}, { headers }); 
      console.log(data);

      if(data.status === 1) {
        // 1. MQTT 전송
        // const payload = {"data": data.messageReport.no, "type": 2 }

        // mqttClient.publish(`chat/order/${orderNo}`, JSON.stringify(payload));

      
        // 3. 메시지 상태 업데이트
        // setMessages([...messages, newMessage]);
        setInput('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 실시간 메시지 도착 처리
  const handleLoad = async(messageNo, type) => {

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const {data} = await axios.get(`/api2/message/receive-by-orderone?messageNo=${messageNo}`, {headers});
      console.log(data);

      if(data.status === 1) {
        if(type === 1) {
          const message = {
            id: Date.now(),
            no : data.messages.no,
            sender: 'chat-buyer',
            text: data.messages.content,
            time: data.messages.sendTime
          };

          setRealtimeMessages(prev => mergeMessages(prev, [message]));
        }
        else if(type === 2) {
          const message = {
            id: Date.now(),
            no : data.messages.no,
            sender: 'chat-seller',
            text: data.messages.content,
            time: data.messages.sendTime
          };

          setRealtimeMessages(prev => mergeMessages(prev, [message]));
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  const loadPrevMessages = async () => {
    if (isLoading || !hasMoreRef.current) return; // ⭐ 더 이상 불러오지 않도록
    setIsLoading(true);

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.get(`/api2/message/receive-by-order?orderNo=${orderNo}&page=${pageRef.current}&cnt=${cnt}`, { headers });
      console.log(data);
      if (data.status === 1) {
        if (data.messages.length === 0) {
          console.log("더 이상 불러올 메시지가 없습니다.");
          hasMoreRef.current = false; // ⭐ 더 이상 불러올 메시지 없음
          return; // 더 이상 불러올 것이 없으면 무한 호출 방지
        }
        const newMessages = data.messages.map((msg, idx) => ({
          id: `msg-${pageRef.current}-${idx}`, // 고유 id 형식
          no: msg.no,
          sender: msg.senderType === 'SELLER' ? 'chat-seller' : 'chat-buyer',
          text: msg.content,
          time: msg.sendTime
        }));
       

        const chatDiv = chatContentRef.current;
        if (!chatDiv) return;

        const prevScrollHeight = chatDiv.scrollHeight;

        setHistoryMessages(prev => {
          const merged = mergeMessages(prev, newMessages);

          requestAnimationFrame(() => {
            const newScrollHeight = chatDiv.scrollHeight;
            const scrollDiff = newScrollHeight - prevScrollHeight;
            chatDiv.scrollTop += scrollDiff;
          });

          return merged;
        });

        pageRef.current += 1;
        setPage(prev => prev + 1);
        console.log("현재 페이지:", pageRef.current, "불러온 메시지 수:", data.messages.length);
      }
    } catch (error) {
      console.error("이전 메시지 불러오기 실패", error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedMessages = [];
  let lastDate = null;

  allMessages.forEach((msg) => {
    const msgDate = msg.time.split(" ")[0];

    if (lastDate !== msgDate) {
      groupedMessages.push({
        type: 'separator',
        date: msgDate
      });
      lastDate = msgDate;
    }

    groupedMessages.push({
      ...msg,
      type: 'message'
    });
  });

  

  return (
    <div className="inquiry-chat-wrapper">
      <div className="chat-header">
        <Text className="chat-header-title">구매자와의 대화</Text>
        <Button onClick={onClose} type="text">X</Button>
      </div>

      <div className="chat-content" ref={chatContentRef}>
        <List
          dataSource={groupedMessages}
          renderItem={(item) =>
            item.type === 'separator' ? (
              <List.Item className="chat-date-separator">
                <div className="date-separator-line">
                  {formatDateSeparator(item.date)}
                </div>
              </List.Item>
            ) : (
              <List.Item className={item.sender === 'chat-buyer' ? 'chat-buyer' : 'chat-seller'}>
                {item.sender === 'chat-buyer' ? (
                  <div className="chat-line left">
                    <div className="chat-avatar-wrapper">
                      <Avatar icon={<UserOutlined />} className="chat-avatar" />
                      <div className="chat-time">{item.time.split(" ")[1].slice(0, 5)}</div>
                    </div>
                    <div className="chat-bubble">
                      <div className="chat-name">구매자</div>
                      <div>{item.text}</div>
                    </div>
                  </div>
                ) : (
                  <div className="chat-line right">
                    <div className="chat-bubble">
                      <div className="chat-name">판매자</div>
                      <div>{item.text}</div>
                    </div>
                    <div className="chat-avatar-wrapper">
                      <Avatar icon={<UserOutlined />} className="chat-avatar" />
                      <div className="chat-time">{item.time.split(" ")[1].slice(0, 5)}</div>
                    </div>
                  </div>
                )}
              </List.Item>
            )
          }
        />
        <div ref={messagesListRef} />
      </div>

      <div className="chat-footer">
        <div className="chat-footer-content">
          <div className="chat-footer-inner">
            <div className="chat-footer-input">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={handleSend}
                placeholder="메시지를 입력하세요"
              />
            </div>
            <Button icon={<SendOutlined />} type="primary" onClick={handleSend}>
              전송
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
