import React, { useEffect, useState, useRef } from 'react';
import { Layout, Space, Carousel, Card, Row, Col, Button, Dropdown, Switch, message } from 'antd';
import {
  HeartOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // ✅ 추가
import './InverterPage.css'
import 'antd/dist/reset.css';

import banner1 from '../assets/Mclaren_720S_Spider_4.0_V8.jpg';
import banner2 from '../assets/임티.jpg';
import Chat from './Chat';


const { Header, Content, Footer } = Layout;
const { Meta } = Card;

const items = [
  { key: '1', label: '마이 페이지', icon: <UserOutlined />, onClick: () => window.location.href = '/mypage' },
  { type: 'divider' },
  { key: '2', label: '로그인', icon: <LoginOutlined />, onClick: () => window.location.href = '/login' },
  { key: '3', label: '로그아웃', icon: <LogoutOutlined />, onClick: () => window.location.href = '/logout' },
  { key: '4', label: '회원가입', icon: <IdcardOutlined />, onClick: () => window.location.href = '/join' },
];

export default function SellerPage() {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]); // ✅ 서버에서 받아올 목록
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [showMegaMenu, setShowMegaMenu] = useState(false);  
  const toggleWrapperRef = useRef(null);
  
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);

    // ✅ 상품 목록 불러오기
    axios.get('/api2/item/selectlist.do')
      .then(res => {
        if (res.data.status === 1) {
           // 백엔드에서 받은 list는 이제 DTO 구조입니다
          const list = res.data.list.map(item => {
            const imgNo = item.imgNoList?.[0];
            const imageUrl = imgNo
              ? `/api2/itemimage/image/${imgNo}`
              : '/default-tool.jpg';

            return {
              id: item.no,
              name: item.title,
              price: item.price,
              discount: item.discount,
              image: imageUrl
            };
          });

          setProductList(list);
        } else {
          console.error('상품 목록 로드 실패', res.data.message);
        }
      })
      .catch(err => console.error('서버 에러', err));
  }, []);
    

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toggleWrapperRef.current && !toggleWrapperRef.current.contains(event.target)) {
        setShowMegaMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updatedItems = isLoggedIn 
    ? items.filter(item => item.key !== '2')
    : items.filter(item => item.key !== '3');

  const handleAddToFavorites = (productId) => {
    setFavorites((prev) => {
      const updated = { ...prev, [productId]: !prev[productId] };
      return updated;
    });
  };

  const handleViewMore = (productId) => {
    window.location.href = `/item-detail-seller/${productId}`;
  };

  return (
    <Layout className={darkMode ? 'dark-mode-1' : ''}>
      <Content style={{ padding: '24px 50px' }}>
        <Carousel autoplay autoplaySpeed={5000} style={{ marginBottom: '30px' }}>
          <div><img src={banner1} alt="배너" style={{ width: '100%', maxWidth: '200px', height: 'auto', display: 'block', margin: '0 auto', borderRadius: '12px' }} /></div>
          <div><img src={banner2} alt="배너" style={{ width: '100%', maxWidth: '200px', height: 'auto', display: 'block', margin: '0 auto', borderRadius: '12px' }} /></div>
        </Carousel>

        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <Button type="primary" style={{ margin: '0 8px', background: '#F7C600', color: '#000000' }}>해머</Button>
          <Button type="primary" style={{ margin: '0 8px', background: '#F7C600', color: '#000000' }}>렌치</Button>
          <Button type="primary" style={{ margin: '0 8px', background: '#F7C600', color: '#000000' }}>스패너</Button>
          <Button type="primary" style={{ margin: '0 8px', background: '#F7C600', color: '#000000' }}>드릴</Button>
        </div>
        <div className="inverter-grid-wrapper">
          <Row gutter={[16, 24]} justify="start">
            {productList.map(product => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={6} xl={6}>
                <Card className="inverter-card" hoverable
                  onClick={() => handleViewMore(product.id)}
                  style={{ borderRadius: '8px', width: '100%' }}
                >
                  <div className="inverter-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="inverter-content">
                   <Meta
                    title={product.name}
                    description={
                      product.price != null ? (
                        <div>
                          {/* 원래 가격 */}
                          <span style={{ textDecoration: 'line-through', marginRight: '8px', color: '#999' }}>
                            {product.price.toLocaleString()}
                            {product.type === 'book' ? '원' : '$'}
                          </span>

                          {/* 할인된 가격 */}
                          <span style={{ fontWeight: 'bold', color: '#ff4d4f', marginRight: '8px' }}>
                            {Math.floor(product.price * (1 - product.discount / 100)).toLocaleString()}
                            {product.type === 'book' ? '원' : '$'}
                          </span>

                          {/* 할인율 문구 */}
                          <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                            ({product.discount}% 할인)
                          </span>
                        </div>
                      ) : (
                        `할인율: ${product.discount}%`
                      )
                    }
                  />

                    <div className="inverter-card-buttons">
                      <Button
                        className="like-btn"
                        type="primary"
                        icon={favorites[product.id] ? <HeartOutlined style={{ color: 'red' }} /> : <HeartOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToFavorites(product.id);
                        }}
                      >
                        {favorites[product.id] ? '찜 취소' : '찜하기'}
                      </Button>

                      <Button
                        className="more-btn"
                        type="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewMore(product.id);
                        }}
                      >
                        More
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#F7C600' }}>인버터 기업 판매 페이지©2025</Footer>
      <Chat />
    </Layout>
  );
}
