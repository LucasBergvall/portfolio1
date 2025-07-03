import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Row, Col, Button, message } from 'antd';
import axios from 'axios';
import { ShoppingCartOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import './GenrePage.css';
import { useSelector } from 'react-redux';
import CustomFooter from './footer/CustomFooter';

const { Content, Footer } = Layout;

export default function GenrePage() {
  // 1. 변수
  const { token } = useSelector(state => state.LoginReducer);
  const { name } = useParams();
  const [productList, setProductList] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [page, setPage] = useState(1);
  const [cnt, setCnt] = useState(20);
  const navigate = useNavigate();
  const [genreName, setGenreName] = useState(''); // ⭐ 추가된 장르명 상태
  const [loading, setLoading] = useState(false);
  const [scrollTrigger, setScrollTrigger] = useState(1); // A 변수 (ex: 1.0, 1.5, 2.0)
  const previousTriggerRef = useRef(Math.floor(scrollTrigger));
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gno = queryParams.get('no');

  // 2. 이펙트
  // 유효한 숫자인 경우에만 요청
  // ① gno가 바뀔 때마다 productList 초기화 & page 초기화
  useEffect(() => {
    if (token) {
      loadFavorites();
    }
  }, [token]);

  useEffect(() => {
    if (!isNaN(gno)) {
      setPage(1);
      setProductList([]);
    }
  }, [gno]);

  useEffect(() => {
    if (!isNaN(gno)) {
      fetchGenreItems(gno, page);
    }
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

  const fetchGenreItems = async (gnoParam, pageParam) => {
    try {
      const { data } = await axios.get(`/api2/item/genrelist/buyer?gno=${gnoParam}&page=${pageParam}&cnt=${cnt}`);
      if (data.status === 1) {
        console.log(data);
        setProductList(prev => [...prev, ...data.list]);
        setGenreName(data.genre);
      }
    } catch (error) {
      console.error(error);
      message.error('장르 상품 로딩 실패');
    }
  };

  const handleViewMore = (product) => {
    if (gno === 21 || product.title === '잡지') {
    navigate(`/item/magazine-detail?no=${product.no}`);
  } else {
    navigate(`/item/item-detail?no=${product.no}`);
  }
  };

  return (
    <Layout>
      <Content className="genre-content">
        <h2 className="genre-title">📚 {genreName} 장르 상품</h2>
        <Row gutter={[16, 24]} justify="start">
          {productList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px', fontSize: '20px' }}>
                로딩중입니다...
              </div>
            ) : (
          
            productList.map(product => (
              <Col key={product.no} xs={24} sm={12} md={8} lg={6}>
                <div className="genre-card" onClick={() => handleViewMore(product)}>
                  <div className="genre-image-wrapper">
                    <img src={product.default_img_url} alt={product.title} className="genre-image" />
                  </div>
                  <div className="genre-info">
                    <h3 className="genre-book-title">{product.title}</h3>
                    <div className='genre-genre'>장르 : {product.genreName}</div>
                    <div className='genre-writer'>작가: {product.writer}</div>
                    <div className="genre-discount-section">
                      {product.discount > 0 && (
                        <span className="genre-discount">{product.discount}% 할인</span>
                      )}
                      <span className={`genre-original-price ${product.discount > 0 ? 'discounted' : ''}`}>
                        {product.bookprice?.toLocaleString()}원
                      </span>
                    </div>
                    <div className="genre-final-price">
                      {(product.bookprice * (100 - product.discount) / 100).toLocaleString()}원
                    </div>
                    <div className='item-buttons'>
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
                      <Button type="primary" icon={<ShoppingCartOutlined />}>
                        장바구니
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            ))
          )}
        </Row>
      </Content>
      <CustomFooter />
    </Layout>
  );
}
