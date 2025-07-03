// CustomerVoicePage.js
import React, { useState } from 'react';
import { Layout, Menu, } from 'antd';
import {
  MessageOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import './css/CustomerVoicePage.css';

const { Sider, Content } = Layout;

const categories = [
  '주문 상품 문의', '배송 관련 문의', '결제 관련 문의',
  '쿠팡 서비스 칭찬', '시스템 개선 의견', '시스템 오류 제보',
  '쿠팡 서비스 불편/제안', '프레시백 반납 신청', '회수 지연 문의'
];

const dummyOrders = [
  { id: 1, date: '2025.05.12', name: 'USB 오디오 컨버터', price: '6,020원' },
  { id: 2, date: '2025.05.05', name: '18W USB 고속 충전기', price: '12,289원' },
  { id: 3, date: '2025.05.04', name: '3A 고속충전 케이블', price: '6,990원' },
];

export default function CustomerVoicePage() {
  const [category, setCategory] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [replyOption, setReplyOption] = useState('문자');
  const [darkMode] = useState(false);


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setImages(files);
  };

  const handleSubmit = () => {
    console.log({ category, selectedOrder, text, images, replyOption });
    alert('문의가 접수되었습니다.');
    setCategory('');
    setSelectedOrder(null);
    setText('');
    setImages([]);
    setReplyOption('문자');
  };

  return (
    <Layout className={darkMode ? 'dark-mode' : ''}>
      <Layout>
        <Sider width={250} className="css-sider">
          <Menu mode="inline" defaultSelectedKeys={['4']} style={{ height: '100%' }}>
            <Menu.Item key="1" icon={<MessageOutlined />}>
              <Link to="/inquiry">1대1 문의</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<QuestionCircleOutlined />}>
              <Link to="/faq">자주 묻는 질문</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<FileTextOutlined />}>
              <Link to="/inquiry">문의내역</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<SmileOutlined />}>
              <Link to="/customer-voice">고객의 소리</Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout style={{ padding: '24px', background: '#f0f2f5' }}>
          <Content className="css-content" style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
            <div className="cv-container">
              <h2>고객의 소리</h2>

              <div className="cv-row">
                <label>유형 선택</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">유형을 선택해주세요</option>
                  {categories.map((c, i) => <option key={i}>{c}</option>)}
                </select>
              </div>

              <div className="cv-row">
                <label>주문 상품 선택</label>
                <button onClick={() => setOrderModalOpen(true)}>주문상품 선택</button>
                {selectedOrder && <span className="cv-order-tag">{selectedOrder.name}</span>}
              </div>

              <div className="cv-row">
                <label>의견 입력</label>
                <textarea
                  rows="6"
                  placeholder="문의 내용을 작성해주세요"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <div className="cv-row">
                <label>이미지 첨부 (최대 3개)</label>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                <div className="cv-preview">
                  {images.map((img, i) => (
                    <span key={i}>{img.name}</span>
                  ))}
                </div>
              </div>

              <div className="cv-row">
                <label>답변 방법</label>
                {['문자', '이메일', '답변 불필요'].map((option) => (
                  <label key={option} style={{ marginRight: '10px' }}>
                    <input
                      type="radio"
                      value={option}
                      checked={replyOption === option}
                      onChange={(e) => setReplyOption(e.target.value)}
                    />{' '}
                    {option}
                  </label>
                ))}
              </div>

              <button className="cv-submit" onClick={handleSubmit}>보내기</button>

              {isOrderModalOpen && (
                <div className="cv-modal">
                  <h4>문의하실 상품을 선택해주세요</h4>
                  <ul>
                    {dummyOrders.map(order => (
                      <li key={order.id} onClick={() => {
                        setSelectedOrder(order);
                        setOrderModalOpen(false);
                      }}>
                        ✔ {order.date} - {order.name} ({order.price})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}