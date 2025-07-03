// InquiryPage.js
import React, { useState, useRef } from 'react';
import { Layout, Menu, Button, } from 'antd';
import {
  MessageOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  SmileOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import InquiryChat from './InquiryChat';
import './css/InquiryPage.css';

const { Sider, } = Layout;

const chatInquiries = [
  { id: 1, title: '배송 문의', date: '2025.05.12' },
  { id: 2, title: '상품 불량 신고', date: '2025.05.10' },
];

const centerInquiries = [
  {
    id: 1,
    question: '[배송일정] 주문한 상품은 언제 배송되나요?',
    answer: '상품은 보통 1~2일 이내 배송됩니다. 마이페이지에서 배송현황을 확인해주세요.'
  },
  {
    id: 2,
    question: '[교환/반품] 상품을 교환/반품하고 싶어요.',
    answer: `상품 수령 후 7일 이내 교환/반품 신청이 가능합니다.\n\n🔹 마이쿠팡 > 주문목록 > 교환/반품 신청 선택`
  },
];

const items = [
  { key: '1', label: '마이 페이지', icon: <UserOutlined />, onClick: () => window.location.href = '/mypage' },
  { type: 'divider' },
  { key: '2', label: '로그인', icon: <LoginOutlined />, onClick: () => window.location.href = '/login' },
  { key: '3', label: '로그아웃', icon: <LogoutOutlined />, onClick: () => window.location.href = '/logout' },
  { key: '4', label: '회원가입', icon: <IdcardOutlined />, onClick: () => window.location.href = '/join' },
];

export default function InquiryPage() {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [darkMode] = useState(false);
  const toggleWrapperRef = useRef(null);
  const [switchOn, setSwitchOn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  
  
  const updatedItems = isLoggedIn
    ? items.filter(item => item.key !== '2')
    : items.filter(item => item.key !== '3');

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <Layout className={darkMode ? 'dark-mode' : ''}>      
      <Layout className="inquiry-sidebar">
        <Sider width={250} className="inquiry-sider">
          <Menu
            mode="inline"
            defaultSelectedKeys={['3']}
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

        <Layout style={{ padding: '24px', background: '#f0f2f5' }}>
          
            <div className="inquiry-layout">
              <div className="inquiry-left">
                <button className="chat-btn" onClick={() => setShowChat(true)}>💬 채팅 상담하기</button>
                <h4>최근 문의내역</h4>
                {chatInquiries.length === 0 ? (
                  <div className="no-inquiry">최근 문의내역이 없습니다.</div>
                ) : (
                  <ul>
                    {chatInquiries.map((item) => (
                      <li key={item.id}>
                        <strong>{item.title}</strong>
                        <div className="date">{item.date}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>  
              <div className="inquiry-right">
                <Button type="primary" onClick={() => navigate('/customer-voice')} style={{ marginBottom: '20px' }}>😄 고객센터 문의</Button>
                {centerInquiries.map((item) => (
                  <div key={item.id} className="faq-item">
                    <div className="faq-q" onClick={() => toggle(item.id)}>
                      <span>Q</span> {item.question}
                      <span className="arrow">{openId === item.id ? '▲' : '▼'}</span>
                    </div>
                    {openId === item.id && (
                      <div className="faq-a">
                        <span>A</span> {item.answer.split('\n').map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
        </Layout>
      </Layout>

      {showChat && <InquiryChat visible={showChat} onClose={() => setShowChat(false)} />}
    </Layout>
  );
}