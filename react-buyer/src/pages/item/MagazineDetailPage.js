// src/pages/MagazineDetailPage.js
import React, { useEffect, useState } from 'react';
import { Layout, message, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import NoImage from '../../assets/defaultimage.jpg';
import './css/MagazineDetailPage.css';

const { Content } = Layout;

export default function MagazineDetailPage() {
  // 1. 변수
  const { token } = useSelector((state) => state.LoginReducer);
  const [product, setProduct] = useState({});
  const [favorites, setFavorites] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itemNo = queryParams.get('no');

  const {
    writer = '',
    genre = '',
    publisher = '',
    price = 0,
    discount = 0,
    itemImgs = [],
    imgUrlList = [],
    thumbnail = '',
  } = product;

  const bookprice = price;
  const mainImageUrl = thumbnail || NoImage;
  const otherImages = imgUrlList || [];
  const originalPrice = bookprice?.toLocaleString() || '';
  const finalPrice = ((bookprice * (100 - discount)) / 100)?.toLocaleString() || '0';

 
  
 

  
  // 2. 이펙트
  useEffect(() => {
    if (token) loadFavorites();
  }, [token]);

  useEffect(() => {
    fetchItem();
  }, []);

  // 3. 함수
  const fetchItem = async () => {
    try {
      const { data } = await axios.get(`/api2/item/select?no=${itemNo}`);
      console.log(data);
      setProduct(data.item);
    } catch (err) {
      console.error(err);
      message.error('상품 정보를 불러오지 못했습니다.');
    }
  };

  const loadFavorites = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('/api2/like/selectlist?page=1&cnt=1000', { headers });
      if (res.data.status === 1) {
        const favoriteMap = {};
        res.data.list.forEach((like) => {
          favoriteMap[like.itemNo] = true;
        });
        setFavorites(favoriteMap);
      }
    } catch (err) {
      console.error(err);
      message.error('찜 목록 불러오기 실패');
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
      const body = { item: { no: product.no } };

      if (!favorites[product.no]) {
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
      console.error(err);
      message.error('에러 발생: ' + err.message);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };





  return (
    <Layout>
      <div className="magazine-detail-container">
        <div className="top-section">
          <div className="main-image">
            <img src={mainImageUrl} alt="대표 이미지" />
          </div>
          <div className="info-box">
            <p className='writer'>작가: {writer}</p>
            <p className="genre">장르: {genre}</p>
            <p className="publisher">출판사: {publisher}</p>
            <p className="original-price">{discount > 0 && `${originalPrice}원`}</p>
            <p className='discount'>할인율 : {`${discount}%`}</p>
            <p className="final-price">{finalPrice}원</p>

            <div className="buttons">
              <Button icon={<ShoppingCartOutlined />} type="primary">장바구니에 담기</Button>
              <Button
                icon={favorites[product.no] ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                onClick={handleAddToFavorites}
              >
                {favorites[product.no] ? '찜 취소' : '찜 하기'}
              </Button>
              <Button onClick={handleCheckout}>구매하기</Button>
            </div>
          </div>
        </div>

        <div className="sub-image-list">
          {otherImages.map((img, idx) => (
            <img key={idx} src={img} alt={`서브 이미지 ${idx}`} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
