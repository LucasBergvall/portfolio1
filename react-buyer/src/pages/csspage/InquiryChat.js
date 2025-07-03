// src/components/InquiryChat.js
import React, { useEffect, useState, useRef } from 'react';
import { Input, Button, List, Avatar, Typography } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import './css/InquiryChat.css'; // 선택

const { Text } = Typography;

export default function InquiryChat({ visible, onClose }) {
  const messagesListRef = useRef(null);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { id: messages.length + 1, sender: 'user', text: input };
    try {
      const { data } = await axios.post('/api1/chat', { question: input });
      setMessages([...messages, newMessage, {
        id: messages.length + 2,
        sender: 'bot',
        text: data.response,
      }]);
      setInput('');
    } catch (error) {
      setMessages([...messages, newMessage, {
        id: messages.length + 2,
        sender: 'bot',
        text: '죄송합니다. 오류가 발생했어요.',
      }]);
    }
  };

  useEffect(() => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '500px',
      height: '600px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      zIndex: 2000,
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div className="chat-header" style={{ backgroundColor: '#1677ff', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: '20px' }}>챗봇 상담</Text>
        <Button onClick={onClose} style={{ color: '#fff' }} type="text">X</Button>
      </div>

      <div className="chat-content" style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
        <List
          dataSource={messages}
          renderItem={(item) => (
            <List.Item className={item.sender === 'user' ? 'chat-user' : 'chat-bot'}>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={item.sender === 'user' ? '나' : '챗봇'}
                description={item.text}
              />
            </List.Item>
          )}
        />
        <div ref={messagesListRef} />
      </div>

      <div className="chat-footer" style={{ padding: '10px', borderTop: '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={handleSend}
            placeholder="메시지를 입력하세요"
            style={{ flex: 1 }}
          />
          <Button icon={<SendOutlined />} type="primary" onClick={handleSend}>전송</Button>
        </div>
      </div>
    </div>
  );
}
