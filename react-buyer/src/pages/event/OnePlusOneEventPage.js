import React, { useState, useRef } from 'react';
import { Layout, Row, Col, Card, Button, Dropdown, Space, Switch } from 'antd';
import {
  HeartOutlined, ShoppingCartOutlined, BookOutlined, DownOutlined, UpOutlined,
  UserOutlined, LoginOutlined, LogoutOutlined, IdcardOutlined, CloseOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './css/OnePlusOneEventPage.css';
import book2 from '../../assets/book2.jpg';
import book5 from '../../assets/book5.jpg';
import book10 from '../../assets/book10.png';

const { Header, Content } = Layout;
const { Meta } = Card;

const onePlusOneProducts = [
  { id: 1, name: '작별하지 않는다', price: 25000, image: book2 },
  { id: 2, name: '듀얼브레인', price: 19900, image: book5 },
  { id: 3, name: '세이노의 가르침', price: 19900, image: book10 },
];

const items = [
  { key: '1', label: '마이 페이지', icon: <UserOutlined />, onClick: () => window.location.href = '/mypage' },
  { type: 'divider' },
  { key: '2', label: '로그인', icon: <LoginOutlined />, onClick: () => window.location.href = '/login' },
  { key: '3', label: '로그아웃', icon: <LogoutOutlined />, onClick: () => window.location.href = '/logout' },
  { key: '4', label: '회원가입', icon: <IdcardOutlined />, onClick: () => window.location.href = '/join' },
];

const OnePlusOneEventPage = () => {
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
      <Content style={{ padding: '40px 60px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📚 1+1 이벤트 - 책 한 권 더!</h2>
        <Row gutter={[16, 24]} justify="start">
          {onePlusOneProducts.map(product => (
            <Col key={product.id} xs={24} sm={12} md={12} lg={8} style={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                hoverable
                style={{
                  borderRadius: '8px',
                  width: '280px',
                  padding: 0,
                  overflow: 'hidden'
                }}
                bodyStyle={{ padding: 0 }}
              >
                <div className="product-image-wrapper">
                  <img src={product.image} alt={product.name} className="product-image" />
                </div>
                <div className="card-body-content">
                  <Meta
                    title={product.name}
                    description={
                      <>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{product.price.toLocaleString()}원</div>
                        <div className="oneplus-badge">📚 1+1 증정</div>
                      </>
                    }
                  />
                  <div className="product-buttons">
                    <Button type="primary" icon={<HeartOutlined />}>찜 하기</Button>
                    <Button type="primary" icon={<ShoppingCartOutlined />}>장바구니</Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default OnePlusOneEventPage;