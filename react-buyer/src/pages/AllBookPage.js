import React, { useEffect, useState, useRef } from 'react';

import { Layout, Card, Row, Col, Button, message } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'antd/dist/reset.css';
import './BuyerPage.css';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import BestSellerSlide from './bestseller/BestSellerSlide';
import Chat from './chat/Chat';
import axios from 'axios'; // ✅ 추가
import CustomFooter from './footer/CustomFooter';

const { Content, Footer } = Layout;

const AllBookPage = () => {
  // 1. 변수
  const { token } = useSelector(state => state.LoginReducer);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [darkMode] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [page, setPage] = useState(1);
  const [cnt, setCnt] = useState(20);
  const [text, setText] = useState("");
  const [productList, setProductList] = useState([]);
  const [scrollTrigger, setScrollTrigger] = useState(1); // A 변수 (ex: 1.0, 1.5, 2.0)
  const previousTriggerRef = useRef(Math.floor(scrollTrigger));

  // 2. 이펙트
  useEffect(() => {
    if (token) {
      loadFavorites();
    }
  }, [token]);
 
  useEffect(() => {
    getItemList();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= fullHeight - 1) {
        setLoading(true);

        setScrollTrigger(prev => {
          const next = parseFloat((prev + 0.5).toFixed(1)); // 0.5씩 증가
          return next;
        });

        // 로딩 해제는 데이터 로딩 후에 해주는 게 일반적이나, 임시로 설정
        setTimeout(() => setLoading(false), 500);
      }
    };

    window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);


  useEffect(() => {
    const current = Math.floor(scrollTrigger);
    const prev = previousTriggerRef.current;

    if (current > prev) {
      previousTriggerRef.current = current;
      setPage(current); // ✅ floor된 값만 page로 설정
      console.log("페이지 증가! →", current);
    }
  }, [scrollTrigger]);

  // 3. 함수

  const loadFavorites = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('/api2/like/selectlist?page=1&cnt=1000', { headers });
      console.log("찜 목록 응답:", res.data);  // ✅ 이거 찍어봐
      if (res.data.status === 1) {
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


  const handleViewMore = (productId) => {
    navigate(`/item/item-detail?no=${productId}`);
  };

  const getItemList = async () => {
    const url = `/api2/item/selectitemlist?page=${page}&cnt=${cnt}&text=${text}`;
    try {
      const { data } = await axios.get(url);
      console.log(data);
      if (data.status === 1) {
        setProductList(prev => [...prev, ...data.list]);
      }
    } catch (error) {
      console.error(error);
      message.error('상품 목록 불러오기 실패');
    }
  }

  const handleAddToCart = async(itemNo) => {
    if(!token) {
      message.info("로그인이 필요합니다.");
      navigate('/login')
      return;
    }
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const url = `/api2/cart/insert`
      const body = { item : {no : itemNo }};
      const { data } = await axios.post( url, body, { headers } );
      console.log(data);
      if(data.status === 1) {
        message.success('장바구니 담기 완료');    
      } else {
        message.error('장바구니에 담기지 않았습니다.');
        }
    } catch (error) {
      console.log(error);
      message.error('에러 발생', + error.message);
    }
  }

  return (
  <Layout>
    <div className="product-section">
      <h2 className="genre-title">📚 전체 도서 목록</h2>
        <Row gutter={[16, 24]} justify="start">
          {productList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', fontSize: '20px' }}>
              로딩중입니다...
            </div>
          ) : (
            productList.map(product => (
              <Col key={product.no} xs={24} sm={12} md={8} lg={6} style={{ display: 'flex', justifyContent: 'center' }}>
                <Card
                  hoverable
                  onClick={() => handleViewMore(product.no)}
                  style={{ borderRadius: '8px', width: '100%', padding: 0, overflow: 'hidden' }}
                >
                  <div className="product-image-wrapper">
                    <img
                      src={product.default_img_url}
                      alt={product.title}
                      className="product-image"
                    />
                  </div>

                  {/* ✅ 커스텀 정보 출력 */}
                  <div className="card-body-content">
                    <div className="book-info">
                      <h3 className="book-title">{product.title}</h3>
                      <div className='book-genre'  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>장르 : {product.genreName}</div>
                      <div className='book-writer'  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>작가: {product.writer}</div>
                      {/* 할인율 표시 */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {product.discount > 0 && (
                          <span style={{ color: 'red', fontWeight: 'bold' }}>
                            {product.discount}% 할인
                          </span>
                        )}
                        <span style={{ textDecoration: product.discount > 0 ? 'line-through' : 'none', color: '#999' }}>
                          {product.bookprice?.toLocaleString()}원
                        </span>
                      </div>

                      {/* 최종 할인가 표시 */}
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                        {(
                          product.bookprice * (100 - product.discount) / 100
                        ).toLocaleString()}원
                      </div>
                    </div>

                    <div className="product-buttons">
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
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={(e) => {
                          e.stopPropagation(); // 부모 카드 onClick 차단
                          handleAddToCart(product.no);
                        }}
                      >
                        장바구니
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
              ))
            )}
        </Row>
    </div>
    <CustomFooter />
  </Layout>
  );
};

export default AllBookPage;