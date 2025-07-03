import React, { useEffect, useState } from 'react';
import { Layout, Card, Image, Button, Divider, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import './css/MdRecommendDetailPage.css';
import NoImage from '../../assets/defaultimage.jpg';

const { Content, Footer } = Layout;
const { Meta } = Card;

export default function MdRecommendDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const recommendId = queryParams.get('no');

  const { token } = useSelector(state => state.LoginReducer);
  const [book, setBook] = useState({});
  const [mainImg, setMainImg] = useState(NoImage);
  const [favorites, setFavorites] = useState({});

  useEffect(() => { fetchRecommendDetail(); }, []);
  useEffect(() => { if (token) loadFavorites(); }, [token]);

  const fetchRecommendDetail = async () => {
    try {
      const { data } = await axios.get(`/api2/mdrecommend/selectone?no=${recommendId}`);
      if (data.status === 1) {
        setBook(data.book);
        if (data.book.imgUrlList?.length > 0) {
          setMainImg(data.book.imgUrlList[0]);
        } else {
          setMainImg(data.book.defaultimg ?? NoImage);
        }
      }
    } catch (err) { message.error("상세 불러오기 실패"); }
  };

  const loadFavorites = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('/api2/like/selectlist?page=1&cnt=1000', { headers });
      if (res.data.status === 1) {
        const favMap = {};
        res.data.list.forEach(like => { favMap[like.itemNo] = true; });
        setFavorites(favMap);
      }
    } catch (err) {
      message.error('찜 목록 불러오기 실패');
    }
  };

  const handleAddToFavorites = async () => {
    if (!token) { message.info('로그인이 필요합니다.'); navigate('/login'); return; }
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const productId = book.itemNo;
      if (!favorites[productId]) {
        await axios.post('/api2/like/insert', { item: { no: productId } }, { headers });
        message.success('찜 등록 완료');
      } else {
        await axios.delete('/api2/like/delete', { headers, data: { item: { no: productId } } });
        message.success('찜 취소 완료');
      }
      await loadFavorites();
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

  const originalPrice = (book.bookprice ?? 0).toLocaleString();
  const finalPrice = ((book.bookprice * (100 - book.discount) / 100) || 0).toLocaleString();

  return (
    <Layout>
      <Content className="md-detail-content">
        <div className="md-detail-container">
          <div className="md-image-section">
            <div className="main-image-with-thumbs">
              <Image className="md-main-image" src={mainImg} alt="대표 이미지" />
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

          <div className="md-info-section">
            <Card>
              <Meta
                title={<div className="md-title">{book.title}</div>}
                description={
                  <div>
                    <div className="md-sub">작가: {book.writer}</div>
                    <div className="md-sub">출판사: {book.publisher}</div>
                    <div className="md-sub">장르: {book.genrename}</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                      {book.discount > 0 && (
                        <span style={{ color: 'red', fontWeight: 'bold' }}>{book.discount}% 할인</span>
                      )}
                      <span style={{ textDecoration: book.discount > 0 ? 'line-through' : 'none', color: '#999' }}>
                        {originalPrice}원
                      </span>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333', textAlign: 'center', marginTop: '8px' }}>
                      {finalPrice}원
                    </div>
                  </div>
                }
              />
              <Divider />
              <p className="md-description">{book.explain}</p>

              <div className="md-button-group">
                <Button type="primary" icon={<ShoppingCartOutlined />} onClick={handleAddToCart}>
                  장바구니 담기
                </Button>
                <Button
                  type="primary"
                  icon={favorites[book.itemNo] ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                  onClick={handleAddToFavorites}
                >
                  {favorites[book.itemNo] ? '찜 취소' : '찜하기'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>서적마켓 ©2025</Footer>
    </Layout>
  );
}
