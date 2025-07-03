import React, { useEffect, useState } from 'react';
import { Layout, Image, Card, Button, Divider, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import axios from 'axios';
import './css/BestSellerDetailPage.css';
import NoImage from '../../assets/defaultimage.jpg';

const { Content, Footer } = Layout;
const { Meta } = Card;

export default function BestSellerDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bookId = queryParams.get('no');
  const [book, setBook] = useState({});
  const [favorites, setFavorites] = useState({});
  const [mainImg, setMainImg] = useState(NoImage);
  const { token } = useSelector((state) => state.LoginReducer);

  useEffect(() => {
    fetchBookDetail();
  }, []);

  useEffect(() => {
    if (token) {
      loadFavorites();
    }
  }, [token]);

  

  const fetchBookDetail = async () => {
    const url = `/api2/bestsellerbook/selectone?no=${bookId}`;
    const { data } = await axios.get(url);
    console.log(data);
    if (data.status === 1) {
      setBook(data.book);
      if (data.book.imgUrlList && data.book.imgUrlList.length > 0) {
        setMainImg(data.book.imgUrlList[0]);
      }
    }
  };

  const handleAddToFavorites = async () => {
    if (!token) {
      message.info('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const productId = book.itemNo;
      if (!favorites[productId]) {
        const body = { item: { no: productId } };
        const res = await axios.post('/api2/like/insert', body, { headers });
        if (res.data.status === 1) {
          message.success('찜 등록 완료');
          await loadFavorites();
        }
      } else {
        const body = { item: { no: productId } };
        const res = await axios.delete('/api2/like/delete', { headers, data: body });
        if (res.data.status === 1) {
          message.success('찜 취소 완료');
          await loadFavorites();
        }
      }
    } catch (err) {
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
      const body = { item: { no: book.itemNo } };  // ⭐ 바로 book.itemNo 사용
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

  return (
    <Layout>
      <Content className="bestseller-detail-content">
        <div className="bestseller-detail-container">

          {/* 이미지 영역 */}
          <div className="bestseller-image-section">
            <div className="main-image-with-thumbs">
              <Image className="bestseller-main-image" src={mainImg} alt="대표 이미지" />
              <div className="thumbnail-list-vertical">
                {book.imgUrlList?.map((url, idx) => (
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
          <div className="bestseller-info-section">
            <Card>
              <Meta
                title={<div className="bestseller-title">{book.title}</div>}
                description={
                  <div>
                    <div className="bestseller-author">작가 : {book.writer}</div>
                    <div className='bestseller-genrename'>장르 : {book.genrename}</div>
                    <div className='bestseller-publisher'>출판사 : {book.publisher}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                      {book.discount > 0 && (
                        <span style={{ color: 'red', fontWeight: 'bold' }}>{book.discount}% 할인</span>
                      )}
                      <span style={{ textDecoration: book.discount > 0 ? 'line-through' : 'none', color: '#999' }}>
                        {book.bookprice?.toLocaleString()}원
                      </span>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', textAlign: 'center', marginTop: '8px' }}>
                      {(book.bookprice * (100 - book.discount) / 100).toLocaleString()}원
                    </div>
                  </div>
                }
              />
              <Divider />
              <p className="bestseller-description">{book.explain}</p>

              {/* ➔ 장바구니 + 찜하기 버튼을 한 줄로 묶기 */}
              <div className="bestseller-button-group">
                <Button 
                  type="primary" 
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                >
                  장바구니에 담기
                </Button>

                <Button
                  type="primary"
                  icon={favorites[book.no] ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ 꼭 넣어주자
                    handleAddToFavorites(book.no);
                  }}
                >
                  {favorites[book.no] ? '찜 취소' : '찜 하기'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', backgroundColor: '#001529', color: '#fff' }}>
        서적마켓 ©2025
      </Footer>
    </Layout>
  );
}
