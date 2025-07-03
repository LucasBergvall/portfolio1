// CSSPage.js
import React, { useState } from 'react';
import { Layout, Menu, Card, } from 'antd';
import {
  QuestionCircleOutlined,
  FileTextOutlined,
  SmileOutlined,
  MessageOutlined,
  UserOutlined,
  IdcardOutlined,
  LogoutOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import InquiryChat from '../csspage/InquiryChat';
import './css/CSSPage.css';

const { Sider, Content } = Layout;

const items = [
  { key: '1', label: '마이 페이지', icon: <UserOutlined />, onClick: () => window.location.href = '/mypage' },
  { type: 'divider' },
  { key: '2', label: '로그인', icon: <LoginOutlined />, onClick: () => window.location.href = '/login' },
  { key: '3', label: '로그아웃', icon: <LogoutOutlined />, onClick: () => window.location.href = '/logout' },
  { key: '4', label: '회원가입', icon: <IdcardOutlined />, onClick: () => window.location.href = '/join' },
];

export default function CssPage() {
  const [showChat, setShowChat] = useState(false);
  const [darkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updatedItems = isLoggedIn
    ? items.filter(item => item.key !== '2')
    : items.filter(item => item.key !== '3');


  return (
    <Layout className={darkMode ? 'dark-mode' : ''}>
      <Layout style={{ flex: 1 }}>
        <Sider width={250} className="css-sider">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%' }}
            items={[
              {
                key: "1",
                icon: <MessageOutlined />,
                label: <span onClick={() => setShowChat(true)}>1대1 문의</span>
              },
              {
                key: "2",
                icon: <QuestionCircleOutlined />,
                label: <Link to="/faq">자주 묻는 질문</Link>
              },
              {
                key: "3",
                icon: <FileTextOutlined />,
                label: <Link to="/inquiry">문의내역</Link>
              },
              {
                key: "4",
                icon: <SmileOutlined />,
                label: <Link to="/customer-voice">고객의 소리</Link>
              }
            ]}
          />
        </Sider>

        <Layout style={{ padding: '0 24px 24px' }}>
          <Content className="css-content">
            <h2>고객센터</h2>
            <Card>
              <p>무엇을 도와드릴까요? 궁금한 점이 있다면 1대1 문의를 통해 상담을 시작해보세요.</p>
            </Card>
            {showChat && (
              <div className="inquiry-chat-overlay">
                <InquiryChat visible={showChat} onClose={() => setShowChat(false)} />
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}