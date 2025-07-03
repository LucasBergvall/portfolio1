import React, { useState } from 'react';
import { Layout, Input, Button, List, Avatar, Typography, Space } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import './Chat.css';
import ChatbotIcon from '../assets/chat_imote.png'; // ✅ 아이콘 불러오기

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

const Chat = () => {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: '안녕하세요! 무엇을 도와드릴까요?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = { id: messages.length + 1, sender: 'user', text: input };
    setMessages([...messages, newMessage, {
      id: messages.length + 2,
      sender: 'bot',
      text: '좋은 질문이에요! 답변을 찾아볼게요.',
    }]);
    setInput('');
  };

  return (
    <>
      {/* ✅ 챗봇 토글 아이콘 버튼 */}
      <div
        onClick={() => setVisible(!visible)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          zIndex: 1100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src={ChatbotIcon} alt="챗봇 아이콘" style={{ width: '32px', height: '32px' }} />
      </div>

      {/* ✅ 실제 채팅창 */}
      {visible && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '400px',
          height: '500px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          backgroundColor: '#fff',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <Layout className="chat-layout" style={{ height: '100%'}}>
            <Header className="chat-header"  style={{ background: '#F7C600'}} >
              <Text style={{ color: '#000000', fontSize: '20px' }}>챗봇 상담</Text>
            </Header>
            <Content className="chat-content">
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
            </Content>
            <Footer className="chat-footer">
              <div style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onPressEnter={handleSend}
                  placeholder="메시지를 입력하세요"
                  style={{ height: '40px', flexGrow: 1 }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSend}
                  style={{ height: '40px', marginLeft: '8px', background: '#F7C600'}}
                />
              </div>
            </Footer>
          </Layout>
        </div>
      )}
    </>
  );
};

export default Chat;
