// BestSellerSlide.js
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import axios from 'axios';
import { Col, Layout, Row } from 'antd';
import { useNavigate } from 'react-router-dom';

import './css/BestSellerSlide.css';

const BestSellerSlide = () => {
  // 1.변수
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  // 2.이펙트
  useEffect(() => {
    fetchBestSellers();
  }, []);

  // 3. 함수
  const fetchBestSellers = async () => {
      const { data } = await axios.get('/api2/bestsellerbook/selectlist');
      if (data.status === 1) {
        console.log("📘 베스트셀러 목록:", data.list); // ✅ 확인
        setBooks(data.list);
      }
    };

  const handleClick = (bookId) => {
    navigate(`/bestseller-detail?no=${bookId}`);
  };

  return (
    <div className="bestseller-section">
      <h2 className="bestseller-title">📚 6월 베스트셀러</h2>

      <div className="bestseller-wrapper">
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={5}
          navigation
          className="publisher-recommend-swiper"
        >
          {books.map((book) => (
            <SwiperSlide key={book.id}>
              <div className="bestseller-card" onClick={() => handleClick(book.id)} style={{ cursor: 'pointer' }}>
                <div className="bestseller-rank">{book.rank}</div>
                <img
                  src={book.imgUrlList && book.imgUrlList.length > 0 ? book.imgUrlList[0] : '/default-image.png'} 
                  alt={book.title}
                  className="bestseller-image"
                  onError={(e) => {
                    e.target.src = `/default-image.png`;
                  }}
                />
                <div className="bestseller-info">
                  <p className="bestseller-title-text">{book.title}</p>

                  {/* 할인 + 원가 한 줄 */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                    {book.discount > 0 && (
                      <span style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '13px' }}>
                        {book.discount}% 할인
                      </span>
                    )}
                    <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '13px' }}>
                      {book.bookprice?.toLocaleString()}원
                    </span>
                  </div>

                    {/* 최종 할인가 */}
                    <div className="bestseller-final-price">
                      {(
                        book.bookprice * (100 - book.discount) / 100
                      ).toLocaleString()}원
                    </div>
                  </div>
                </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BestSellerSlide;

