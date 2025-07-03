// DiscountEventPage.js
import React, { useState, useRef } from 'react';
import { Row, Col, Card, Button, Form,Layout, Menu, Space, Dropdown, Switch, message, Input } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, UserOutlined, FileTextOutlined,
  FileSearchOutlined, BookOutlined, CloudOutlined, StarOutlined,
  DownOutlined, UpOutlined, LoginOutlined, LogoutOutlined, IdcardOutlined, CloseOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './css/DiscountEventPage.css';
import book1 from '../../assets/book1.jpg';
import book2 from '../../assets/book2.jpg';
import book3 from '../../assets/book3.jpg';

const { Meta } = Card;

const discountProducts = [
  { id: 1, name: '2025 해커스 AFPK 핵심문제집', originalPrice: 39000, discountRate: 30, image: book1 },
  { id: 2, name: '작별하지 않는다', originalPrice: 25000, discountRate: 20, image: book2 },
  { id: 3, name: '포기할 자유', originalPrice: 78000, discountRate: 40, image: book3 },
];

const { Header, Sider } = Layout;

const items = [
  { key: '1', label: '마이 페이지', icon: <UserOutlined />, onClick: () => window.location.href = '/mypage' },
  { type: 'divider' },
  { key: '2', label: '로그인', icon: <LoginOutlined />, onClick: () => window.location.href = '/login' },
  { key: '3', label: '로그아웃', icon: <LogoutOutlined />, onClick: () => window.location.href = '/logout' },
  { key: '4', label: '회원가입', icon: <IdcardOutlined />, onClick: () => window.location.href = '/join' },
];

const DiscountEventPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const isSeller = location.pathname.includes('/seller');
  const [switchOn, setSwitchOn] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const toggleWrapperRef = useRef(null);
  const [darkMode] = useState(false);
    
  const updatedItems = isLoggedIn
    ? items.filter(item => item.key !== '2')
    : items.filter(item => item.key !== '3');

  return (
    <Layout className={darkMode ? 'dark-mode' : ''}>    
      <div style={{ padding: '40px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📚 도서 할인전 - 최대 70% 할인!</h2>
        <Row gutter={[16, 24]} justify="start">
          {discountProducts.map(product => {
            const discountedPrice = Math.round(product.originalPrice * (1 - product.discountRate / 100));

            return (
             <Col key={product.id} xs={24} sm={12} md={12} lg={8} style={{ display: 'flex', justifyContent: 'center' }}>
                <Card
                  hoverable
                  style={{
                    borderRadius: '8px',
                    width: '280px', // 💡 고정 폭 또는 최대 폭으로 지정
                    padding: 0,
                    overflow: 'hidden'
                  }}
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="product-image-wrapper">
                    <img src={product.image} alt={product.name} className="product-image" />
                  </div>
                  <div className="card-body-content">
                    <Meta title={product.name} description={
                      <>
                        <span style={{ color: 'red', fontWeight: 'bold', marginRight: '8px' }}>{discountedPrice.toLocaleString()}원</span>
                        <span style={{ textDecoration: 'line-through', color: 'gray', fontSize: '14px' }}>{product.originalPrice.toLocaleString()}원</span>
                        <div style={{ color: '#52c41a', fontWeight: 'bold' }}>{product.discountRate}% 할인</div>
                      </>
                    } />
                    <div className="product-buttons">
                      <Button type="primary" icon={<HeartOutlined />}>찜 하기</Button>
                      <Button type="primary" icon={<ShoppingCartOutlined />}>장바구니</Button>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </Layout>
  );
};

export default DiscountEventPage;
