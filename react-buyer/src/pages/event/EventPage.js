// src/pages/EventPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Card, Row, Col } from 'antd';
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './css/EventPage.css';
import Chat from '../chat/Chat';

const { Content, Footer } = Layout;

const items = [
  { key: '1', label: '마이 페이지', icon: <UserOutlined />, onClick: () => window.location.href = '/mypage' },
  { type: 'divider' },
  { key: '2', label: '로그인', icon: <LoginOutlined />, onClick: () => window.location.href = '/login' },
  { key: '3', label: '로그아웃', icon: <LogoutOutlined />, onClick: () => window.location.href = '/logout' },
  { key: '4', label: '회원가입', icon: <IdcardOutlined />, onClick: () => window.location.href = '/join' },
];

export default function EventPage() {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const toggleWrapperRef = useRef(null);

  const updatedItems = isLoggedIn
    ? items.filter(item => item.key !== '2')
    : items.filter(item => item.key !== '3');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toggleWrapperRef.current && !toggleWrapperRef.current.contains(event.target)) {
        setShowMegaMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const events = [
    { title: '도서 할인전 🔥', price: '최대 70% 할인', desc: '인기 도서 할인 이벤트 중!' },
    { title: '1+1 이벤트 📚', price: '책 한 권 더!', desc: '특정 도서 구매 시 한 권 더!' },
    { title: '신간 런칭 이벤트 🚀', price: '사전 예약 시 선물', desc: '신간 사전 구매 이벤트' },
  ];

  return (
    <Layout>
      <Content style={{ padding: '24px 50px' }}>
      <h1 className="event-page-title" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>진행중 이벤트</h1>
        <Row gutter={[24, 24]}>
          {events.map((event, index) => (
            <Col span={8} key={index}>
              <Card
                title={event.title}
                bordered={false}
                hoverable
                className="event-card"
                onClick={() => {
                  if (event.title.includes('도서 할인전')) {
                    navigate('/event/discount');
                  } else if (event.title.includes('1+1 이벤트')) {
                    navigate('/event/oneplusone');
                  }
                  else if (event.title.includes('신간 런칭 이벤트')) {
                    navigate('/event/launch');
                  }
                }}
              >
                <p>{event.desc}</p>
                <strong>{event.price}</strong>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>

      <Footer style={{ textAlign: 'center' }}>서적마켓 ©2025</Footer>
      <Chat />
    </Layout>
  );
}