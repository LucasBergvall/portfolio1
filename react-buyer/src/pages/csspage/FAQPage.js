// FAQPageWithLayout.js
import React, { useState, useRef } from 'react';
import { Layout, Menu } from 'antd';
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
import './css/FAQPage.css';
import InquiryChat from './InquiryChat';

const { Sider, Content } = Layout;

const faqData = [
  {
    question: '[배송일정] 주문한 상품은 언제 배송되나요?',
    answer: '보통 상품은 결제일 기준으로 1~2일 이내 출고됩니다. 배송 상황은 마이페이지에서 확인해주세요.'
  },
  {
    question: '[교환/반품] 상품을 교환/반품하고 싶어요.',
    answer: '상품 수령 후 7일 이내 마이페이지 > 주문내역에서 교환/반품 신청이 가능합니다.'
  },
  {
    question: '[와우 멤버십] 와우 멤버십을 해지하고 싶어요.',
    answer: '마이쿠팡 > 와우 멤버십 > 해지하기에서 해지 가능합니다. 해지 후에도 남은 기간까지 사용 가능합니다.'
  },
  {
    question: '[쿠팡 와우카드] 쿠팡 와우카드 연회비는 얼마인가요?',
    answer: '연회비는 기본 1만 원이며, 카드사에 따라 달라질 수 있습니다.'
  },
  {
    question: '[중복주문] 주문/결제가 중복으로 되었어요.',
    answer: '중복 결제된 경우 1~3일 내 자동 환불됩니다. 환불 내역은 결제수단에 따라 다를 수 있습니다.'
  },
];

const items = [
  { key: '1', label: '마이 페이지', icon: <UserOutlined />, onClick: () => window.location.href = '/mypage' },
  { type: 'divider' },
  { key: '2', label: '로그인', icon: <LoginOutlined />, onClick: () => window.location.href = '/login' },
  { key: '3', label: '로그아웃', icon: <LogoutOutlined />, onClick: () => window.location.href = '/logout' },
  { key: '4', label: '회원가입', icon: <IdcardOutlined />, onClick: () => window.location.href = '/join' },
];

export default function FAQPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [darkMode] = useState(false);
  const toggleWrapperRef = useRef(null);
  const [switchOn, setSwitchOn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updatedItems = isLoggedIn
    ? items.filter(item => item.key !== '2')
    : items.filter(item => item.key !== '3');

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Layout className={darkMode ? 'dark-mode' : ''}>
      <Layout className="faq-sidebar">
        <Sider width={250} className="faq-sider">
          <Menu
            mode="inline"
            defaultSelectedKeys={['2']}
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
          <Content className="faq-content" style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
            <h2 className="faq-title">❓ 자주 묻는 질문</h2>
            <ul className="faq-list">
              {faqData.map((faq, idx) => (
                <li key={idx} className={`faq-item ${openIndex === idx ? 'open' : ''}`}>
                  <div className="faq-question" onClick={() => toggleFAQ(idx)}>
                    <span>Q</span> {faq.question}
                    <span className="faq-icon">{openIndex === idx ? '▲' : '▼'}</span>
                  </div>
                  {openIndex === idx && (
                    <div className="faq-answer">
                      <strong>A</strong> {faq.answer}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Content>
        </Layout>
      </Layout>

      {showChat && <InquiryChat visible={showChat} onClose={() => setShowChat(false)} />}
    </Layout>
  );
}
