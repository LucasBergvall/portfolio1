// src/pages/PurchaseHistory.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, List, Rate, Modal, Input, Button, message, Layout, Menu } from 'antd';
import './css/PurchaseHistory1.css';
import {
  ShoppingCartOutlined, HeartOutlined, UserOutlined, FileTextOutlined,
  FileSearchOutlined, StarOutlined, LoginOutlined, LogoutOutlined, IdcardOutlined
} from '@ant-design/icons';

const { Header, Sider } = Layout;

const items = [
  { key: '1', label: '마이 페이지', icon: <UserOutlined />, onClick: () => window.location.href = '/mypage' },
  { type: 'divider' },
  { key: '2', label: '로그인', icon: <LoginOutlined />, onClick: () => window.location.href = '/login' },
  { key: '3', label: '로그아웃', icon: <LogoutOutlined />, onClick: () => window.location.href = '/logout' },
  { key: '4', label: '회원가입', icon: <IdcardOutlined />, onClick: () => window.location.href = '/join' },
];

export default function PurchaseHistory() {
  const [ratingVisible, setRatingVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const toggleWrapperRef = useRef(null);
  const [darkMode] = useState(false);

  
  const [purchases, setPurchases] = useState([
    { id: 1, title: '리액트 입문서', date: '2025-04-01', rated: false, rating: 0, comment: '' },
    { id: 2, title: '자바스크립트 핵심', date: '2025-04-02', rated: true, rating: 4, comment: '좋은 책이에요!' },
  ]);

  const openRatingModal = (item) => {
    setCurrentItem(item);
    setRating(0);
    setComment('');
    setRatingVisible(true);
  };

  const handleRatingSubmit = () => {
    console.log('등록할 평점:', { item: currentItem, rating, comment });
    message.success('평점이 등록되었습니다!');
    setPurchases(prev =>
      prev.map(p => 
        p.id === currentItem.id 
          ? { ...p, rated: true, rating: rating, comment: comment }
          : p
      )
    );
    setRatingVisible(false);
  };

  return (

    <Layout className={darkMode ? 'dark-mode' : ''}>
      <Layout style={{ flex: 1 }}>
        <div className="purchase-history-page">
          <h2>구매내역</h2>
          <Card style={{ width: '100%' }}>
          <List
              dataSource={purchases}
              renderItem={(item) => (
                <List.Item className="purchase-item">
                  <div className="purchase-left">
                    <div className="purchase-title">{item.title}</div>
                    <div className="purchase-date">구매일: {item.date}</div>
                  </div>

                  <div className="purchase-right">
                    {item.rated ? (
                      <div className="purchase-rating">
                        <Rate disabled value={item.rating} />
                        <span className="purchase-comment">({item.comment})</span>
                      </div>
                    ) : (
                      <Button type="link" onClick={() => openRatingModal(item)}>평점 등록</Button>
                    )}
                  </div>
                </List.Item>
              )}
            />
          </Card>

          {/* 평점 등록 모달 */}
          <Modal
            title="평점 등록"
            open={ratingVisible}
            onCancel={() => setRatingVisible(false)}
            onOk={handleRatingSubmit}
            okText="등록"
            cancelText="취소"
          >
            <p>상품: {currentItem?.title}</p>
            <Rate value={rating} onChange={setRating} />
            <Input.TextArea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="코멘트를 입력하세요"
              style={{ marginTop: '10px' }}
            />
          </Modal>
        </div>
      </Layout>
    </Layout>
  );
}
