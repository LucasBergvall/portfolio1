// src/pages/ChatPage2.js
import React, { useEffect, useRef, useState } from 'react';
import { Input, Button, List } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import './css/ChatPage2.css';
import axios from 'axios';

const ChatPage2 = () => {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: '안녕하세요~ 뭐 도와드릴까요?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { id: messages.length + 1, sender: 'user', text: input };
    const { data } = await axios.post('/api1/chat', { question: input });
    const botMessage = { id: messages.length + 2, sender: 'bot', text: data.response };
    setMessages([...messages, userMessage, botMessage]);
    setInput('');
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="kakao-chat-page">
      <div className="kakao-chat-box">
        <div className="kakao-chat-header">챗봇 상담</div>
        <div className="kakao-chat-content">
          <List
            dataSource={messages}
            renderItem={(item) => (
              <List.Item className={`chat-bubble-wrapper ${item.sender}`}>
                <div className="chat-bubble">
                  {item.text}
                </div>
              </List.Item>
            )}
          />
          <div ref={messagesEndRef} />
        </div>
        <div className="kakao-chat-footer">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={handleSend}
            placeholder="메시지 입력"
            className="kakao-input"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            className="kakao-send-btn"
          >
            전송
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage2;
