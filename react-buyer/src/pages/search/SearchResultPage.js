// src/pages/search/SearchResultPage.jsx

import React, { useEffect, useState, useRef } from 'react';
import { Layout, Card, Row, Col, Button, message } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './css/SearchResultPage.css';
import CustomFooter from '../footer/CustomFooter';

const { Content } = Layout;

export default function SearchResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useSelector(state => state.LoginReducer);

  const [result, setResult] = useState([]);
  const [total, setTotal] = useState(0);
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [cnt] = useState(20);
  const [scrollTrigger, setScrollTrigger] = useState(1);
  const previousTriggerRef = useRef(Math.floor(scrollTrigger));

  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');
  const keyword = queryParams.get('keyword');

  useEffect(() => {
    if (token) loadFavorites();
  }, [token]);

  useEffect(() => {
    if (page !== 1) {
      getSearchResults(page);
    }
  }, [page]);

  // 🔄 검색 조건 변경 시 초기화
  useEffect(() => {
    setResult([]);
    setPage(1);
    setScrollTrigger(1);
    previousTriggerRef.current = 1;
    getSearchResults(1); // ✅ page=1로 검색 즉시 실행
  }, [type, keyword]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading) return;
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight >= fullHeight - 1) {
        setLoading(true);
        setScrollTrigger(prev => parseFloat((prev + 0.5).toFixed(1)));
        setTimeout(() => setLoading(false), 500);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  useEffect(() => {
    const current = Math.floor(scrollTrigger);
    const prev = previousTriggerRef.current;
    if (current > prev) {
      previousTriggerRef.current = current;
      setPage(current);
    }
  }, [scrollTrigger]);

  const loadFavorites = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('/api2/like/selectlist?page=1&cnt=1000', { headers });
      if (res.data.status === 1) {
        const favoriteMap = {};
        res.data.list.forEach(like => {
          favoriteMap[like.itemNo] = true;
        });
        setFavorites(favoriteMap);
      }
    } catch (err) {
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
      const body = { item: { no: productId } };
      if (!favorites[productId]) {
        const res = await axios.post('/api2/like/insert', body, { headers });
        if (res.data.status === 1) {
          message.success('찜 등록 완료');
          await loadFavorites();
        }
      } else {
        const res = await axios.delete('/api2/like/delete', { headers, data: body });
        if (res.data.status === 1) {
          message.success('찜 취소 완료');
          await loadFavorites();
        }
      }
    } catch (err) {
      message.error('찜 처리 중 오류 발생');
    }
  };

  const handleAddToCart = async (itemNo) => {
    if (!token) {
      message.info('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = { item: { no: itemNo } };
      const res = await axios.post('/api2/cart/insert', body, { headers });
      if (res.data.status === 1) {
        message.success('장바구니 담기 완료');
      } else {
        message.error('장바구니 담기 실패');
      }
    } catch (err) {
      message.error('장바구니 처리 중 오류 발생');
    }
  };

  const getSearchResults = async (pageParam = page) => {
    try {
      const res = await axios.get(`/api2/item/search`, {
        params: { type, keyword, page: pageParam, cnt }
      });

      if (res.data.status === 1) {
        console.log(res.data);
        setResult(prev => pageParam === 1 ? res.data.list : [...prev, ...res.data.list]);
        setTotal(res.data.total);
      } else {
        message.error('검색 실패: ' + res.data.message);
      }
    } catch (err) {
      message.error('검색 중 오류 발생');
    }
  };

  const handleViewMore = (itemNo) => {
    navigate(`/item/item-detail?no=${itemNo}`);
  };

  return (
    <Layout>
      <div className="search-result-section">
        <h2 className="search-result">🔍 검색 결과 ({total}건)</h2>
        <Row gutter={[16, 24]} justify="start">
          {result.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', fontSize: '20px' }}>
              검색 결과가 없습니다.
            </div>
          ) : (
            result.map(product => (
              <Col key={product.no} xs={24} sm={12} md={8} lg={6} style={{ display: 'flex', justifyContent: 'center' }}>
                <Card
                  hoverable
                  onClick={() => handleViewMore(product.no)}
                  style={{ borderRadius: '8px', width: '100%', padding: 0, overflow: 'hidden' }}
                >
                  <div className="search-result-image-wrapper">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="search-result-image"
                    />
                  </div>
                  <div className="card-body-content">
                    <div className="book-info">
                      <h3 className="book-title">{product.title}</h3>
                      <div className='book-genre' style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>장르 : {product.genreName}</div>
                      <div className='book-writer' style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>작가 : {product.writer}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {product.discount > 0 && (
                          <span style={{ color: 'red', fontWeight: 'bold' }}>{product.discount}% 할인</span>
                        )}
                        <span style={{ textDecoration: product.discount > 0 ? 'line-through' : 'none', color: '#999' }}>
                          {product.price?.toLocaleString()}원
                        </span>
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                        {(product.price * (100 - product.discount) / 100).toLocaleString()}원
                      </div>
                    </div>
                    <div className="search-result-buttons">
                      <Button
                        type="primary"
                        icon={favorites[product.no] ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToFavorites(product.no);
                        }}
                      >
                        {favorites[product.no] ? '찜 취소' : '찜 하기'}
                      </Button>
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
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
}