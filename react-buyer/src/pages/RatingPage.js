// src/pages/RatingPage.js
import React, { useState, useRef } from 'react';
import { Card, Progress, Button,Layout, Menu, Space, Dropdown, Switch } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './RatingPage.css';

import {
  ShoppingCartOutlined, HeartOutlined, UserOutlined, FileTextOutlined,
  FileSearchOutlined, BookOutlined, CloudOutlined, StarOutlined,
  DownOutlined, UpOutlined, LoginOutlined, LogoutOutlined, IdcardOutlined, CloseOutlined
} from '@ant-design/icons';

const { Header, Sider } = Layout;

const items = [
  { key: '1', label: '마이 페이지', icon: <UserOutlined />, onClick: () => window.location.href = '/mypage' },
  { type: 'divider' },
  { key: '2', label: '로그인', icon: <LoginOutlined />, onClick: () => window.location.href = '/login' },
  { key: '3', label: '로그아웃', icon: <LogoutOutlined />, onClick: () => window.location.href = '/logout' },
  { key: '4', label: '회원가입', icon: <IdcardOutlined />, onClick: () => window.location.href = '/join' },
];

export default function RatingPage({ purchases = [] }) {
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

  const ratedItems = purchases.filter(item => item.rated);
  const averageRating = ratedItems.length > 0
    ? (ratedItems.reduce((sum, item) => sum + item.rating, 0) / ratedItems.length).toFixed(2)
    : 0;

  return (
    <Layout className={darkMode ? 'dark-mode' : ''}>
      <Layout style={{ flex: 1 }}>
        <Sider width={250} className="mypage-sider" >
          <Menu mode="inline" defaultSelectedKeys={['6']} style={{ height: '100%' }}>
            <Menu.Item key="1" icon={<UserOutlined />}><Link to="/profile">회원정보 관리</Link></Menu.Item>
            <Menu.Item key="2" icon={<FileTextOutlined />}><Link to="/purchase-history">구매내역</Link></Menu.Item>
            <Menu.Item key="3" icon={<HeartOutlined />}><Link to="/like">찜한상품</Link></Menu.Item>
            <Menu.Item key="4" icon={<ShoppingCartOutlined />}><Link to="/cart">장바구니</Link></Menu.Item>
            <Menu.Item key="5" icon={<FileSearchOutlined />}><Link to="/address">배송주소 관리</Link></Menu.Item>
          </Menu>
        </Sider>

        <div className="rating-page">
          <h2>거래 평점</h2>
          <Card className="rating-card">
            <div className="rating-summary">
              <h3>나의 평균 평점</h3>
              <div className="rating-value">{averageRating} / 5.0</div>
              <Progress 
                percent={averageRating * 20} 
                showInfo={false} 
                strokeColor="#faad14"
              />
            </div>

            <div className="rating-detail">
              {ratedItems.length > 0 ? (
                ratedItems.map(item => (
                  <div key={item.id} className="rating-item">
                    <strong>{item.title}</strong>
                    <span> ⭐ {item.rating}점 - {item.comment}</span>
                  </div>
                ))
              ) : (
                <p>아직 등록된 평점이 없습니다.</p>
              )}
            </div>
          </Card>
        </div>
      </Layout>
    </Layout>
  );
}
