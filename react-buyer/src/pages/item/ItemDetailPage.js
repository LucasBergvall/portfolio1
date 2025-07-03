// src/pages/ItemDetailPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Image, Card, Button, Divider, message } from 'antd';
import './css/ItemDetailPage.css';
import {
  HeartOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  HeartFilled,
  LoginOutlined,
  LogoutOutlined,
  IdcardOutlined,
} from '@ant-design/icons';

import axios from 'axios';
import { useSelector } from 'react-redux';
import NoImage from '../../assets/defaultimage.jpg';

const { Header, Content, Footer } = Layout;
const { Meta } = Card;

const items = [
  { key: '1', label: '마이 페이지', icon: <UserOutlined />, onClick: () => window.location.href = '/mypage' },
  { type: 'divider' },
  { key: '2', label: '로그인', icon: <LoginOutlined />, onClick: () => window.location.href = '/login' },
  { key: '3', label: '로그아웃', icon: <LogoutOutlined />, onClick: () => window.location.href = '/logout' },
  { key: '4', label: '회원가입', icon: <IdcardOutlined />, onClick: () => window.location.href = '/join' },
];

export default function ItemDetailPage() {
  
  // 1. 변수
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const toggleWrapperRef = useRef(null);
  const { token, logged } = useSelector((state) => state.LoginReducer);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itemNo = queryParams.get('no');
  const [favorites, setFavorites] = useState({});
  const [product, setProduct] = useState({});
  const [mainImg, setMainImg] = useState(NoImage); // 대표 이미지




  // 2. 이펙트
  // ✅ Hook은 모두 return 전에 선언되어야 함
  useEffect(() => {
      if (token) {
        loadFavorites();
      }
    }, [token]);

  useEffect(() => {
    itemlist();
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


  // 3. 함수
  const loadFavorites = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('/api2/like/selectlist?page=1&cnt=1000', { headers });
      console.log("찜 목록 응답:", res.data);  // ✅ 이거 찍어봐
      if (res.data.status === 1) {
        console.log(res.data)
        const favoriteMap = {};
        res.data.list.forEach(like => {
          favoriteMap[like.itemNo] = true;
        });
        setFavorites(favoriteMap);
      }
    } catch (err) {
      console.error("loadFavorites 에러 발생:", err);
      message.error('찜 목록 불러오기 실패');
    }
  };
  
 const handleAddToFavorites = async (productId) => {
    if (!token) {
      message.info('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (!favorites[productId]) {
        const body = { item: { no: productId } };
        const res = await axios.post('/api2/like/insert', body, { headers });
        if (res.data.status === 1) {
          message.success('찜 등록 완료');
          await loadFavorites();  // ⭐ 다시 불러오기 (안전)
        }
      } else {
        const body = { item: { no: productId } };
        const res = await axios.delete('/api2/like/delete', { headers, data: body });
        if (res.data.status === 1) {
          message.success('찜 취소 완료');
          await loadFavorites();  // ⭐ 다시 불러오기 (안전)
        }
      }
    } catch (err) {
      console.error(err);
      message.error('에러 발생: ' + err.message);
    }
  };

  const handleAddToCart = async () => {
    if(!token) {
      message.info("로그인이 필요합니다.");
      navigate('/login');
      return;
    }
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const url = `/api2/cart/insert`;
      const body = { item: { no: product.no } };  // ⭐ 바로 book.itemNo 사용
      const { data } = await axios.post(url, body, { headers });
      if (data.status === 1) {
        message.success('장바구니 담기 완료');    
      } else {
        message.error('장바구니에 담기지 않았습니다.');
      }
    } catch (error) {
      console.log(error);
      message.error('에러 발생: ' + error.message);
    }
  }

 

  // ✅ 결제하기 버튼 클릭 핸들러
  const handleCheckout = () => {
    navigate('/checkout', {
    });
  };

  const itemlist = async () => {
    const url = `/api2/item/select?no=${itemNo}`;
    const { data } = await axios.get(url);
    console.log(data);
    setProduct(data.item);
    setMainImg(data.item.imgUrlList?.[0] || ''); // 대표 이미지 설정
  };
  
  
    return (
      <Layout className={darkMode ? 'dark-mode' : ''}>
        <Content
          style={{
            padding: '40px 50px',
            backgroundColor: '#f7f7f7',
            minHeight: 'calc(100vh - 64px - 70px)',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'auto' // ⬅ 선택사항
          }}
        >
          <div className="item-detail-container">
            {/* 이미지 영역 */}
           <div className="image-section">
            <div className="main-image-with-thumbs">
              {/* 대표 이미지 */}
              <Image className="item-detail-image" src={mainImg} alt="대표 이미지" />

              {/* 썸네일 리스트 (가로에서 오른쪽에 위치) */}
              <div className="thumbnail-list-vertical">
                {product.imgUrlList?.map((url, idx) => (
                  <Image
                    key={idx}
                    width={60}
                    height={60}
                    className={`thumbnail ${mainImg === url ? 'active' : ''}`}
                    src={url}
                    onClick={() => setMainImg(url)}
                    preview={false}
                  />
                ))}
              </div>
            </div>
          </div>

            {/* 상품 정보 영역 */}
            <div className="item-detail-info">
              <Card>
                <Meta
                  title={
                    <div style={{ whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word', lineHeight: '1.4' }}>
                      {product.title}
                    </div>
                  }
                />
                <div className='item-writer'>작가 : {product.writer}</div>
                  <div className='genrename'>장르 : {product.genreName}</div>
                  <div className='publisher'>출판사 : {product.publisher}</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                      {product.discount > 0 && (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>{product.discount}% 할인</span>
                      )}
                      <span style={{
                          textDecoration: product.discount > 0 ? 'line-through' : 'none',
                          color: '#999'
                      }}>
                        {product.price?.toLocaleString()}원
                      </span>
                  </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', textAlign: 'center', marginTop: '8px' }}>
                      {(product.price * (100 - product.discount) / 100).toLocaleString()}원
                    </div>
                  
                  <Divider />
                  <p className="item-detail-description">{product.explain}</p>
                  <div className="item-detail-button-container">

                  {/* ➔ 장바구니 + 찜하기 버튼을 한 줄로 묶기 */}
                  <div className="inline-button-group">
                    <Button 
                      type="primary" 
                      icon={<ShoppingCartOutlined />}
                      onClick={handleAddToCart}
                    >
                      장바구니에 담기
                    </Button>

                    <Button
                      type="primary"
                      icon={favorites[product.no] ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ 꼭 넣어주자
                        handleAddToFavorites(product.no);
                      }}
                    >
                      {favorites[product.no] ? '찜 취소' : '찜 하기'}
                    </Button>
                  </div>

                  {/* ➔ 구매하기 버튼은 단독 아래 배치 */}
                  <Button onClick={handleCheckout} style={{ width: '100%' }}>
                    구매하기
                  </Button>

                </div>
              </Card>
            </div>
          </div>
        </Content>
    </Layout>
  );
}
