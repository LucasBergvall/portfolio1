import React, { useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Card, Input, Button, message } from 'antd';
import './css/PreOrderPage.css';
import book4 from '../../assets/book4.jpg';
import book6 from '../../assets/book6.jpg';
import book9 from '../../assets/book9.jpg';

import { UserOutlined, LoginOutlined, LogoutOutlined, IdcardOutlined } from '@ant-design/icons';

const { Content } = Layout;

// 도서 샘플 데이터 (ID 기반 매칭용)
const bookData = [
  { id: 1, name: '새로운 지식의 탄생', price: 22000, benefit: '북마크 세트 증정', image: book4 },
  { id: 2, name: '인공지능과 미래 사회', price: 27000, benefit: '한정판 굿즈 포함', image: book6 },
  { id: 3, name: '2030 생존전략', price: 25000, benefit: '배송비 무료 + 사인본 이벤트', image: book9 },
];

const items = [
  { key: '1', label: '마이 페이지', icon: <UserOutlined />, onClick: () => window.location.href = '/mypage' },
  { type: 'divider' },
  { key: '2', label: '로그인', icon: <LoginOutlined />, onClick: () => window.location.href = '/login' },
  { key: '3', label: '로그아웃', icon: <LogoutOutlined />, onClick: () => window.location.href = '/logout' },
  { key: '4', label: '회원가입', icon: <IdcardOutlined />, onClick: () => window.location.href = '/join' },
];

const PreOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = bookData.find(b => b.id === parseInt(id));

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

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

  const handleSubmit = () => {
    if (!name || !email || !phone) {
      message.warning('모든 정보를 입력해주세요.');
      return;
    }

    message.success(`"${book.name}" 예약이 완료되었습니다!`);
    navigate('/event'); // 예약 완료 후 이벤트 페이지로 이동
  };

  if (!book) return <div style={{ padding: 40 }}>❌ 도서를 찾을 수 없습니다.</div>;

  return (

    <Layout className={darkMode ? 'dark-mode' : ''}> 
      <Layout className="preorder-layout">
        <Content className="preorder-content">
          <h2>📚 사전 예약 신청</h2>
          <Card className="preorder-card" cover={<img alt={book.name} src={book.image} className="preorder-img" />}>
            <h3>{book.name}</h3>
            <p><strong>가격:</strong> {book.price.toLocaleString()}원</p>
            <p><strong>혜택:</strong> {book.benefit}</p>
          </Card>

          <div className="preorder-form">
            <Input
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="전화번호"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button type="primary" onClick={handleSubmit} style={{ marginTop: '16px' }}>
              사전 예약 제출
            </Button>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default PreOrderPage;
