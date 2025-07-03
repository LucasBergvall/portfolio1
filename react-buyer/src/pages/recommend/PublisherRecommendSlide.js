import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import axios from 'axios';
import './css/PublisherRecommendSlide.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { message } from 'antd';

const PublisherRecommendSlide = () => {

  // 1. 변수
  const { token } = useSelector(state => state.LoginReducer);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState({});

  // 2. 이펙트
  useEffect(() => {
    fetchRecommendBooks();
  }, []);
  
  // 3. 함수
  

  const fetchRecommendBooks = async () => {
    try {
      const { data } = await axios.get(encodeURI('/api2/recommend/group/출판사추천'));
      if (data.status === 1) {
        setBooks(data.list);
        console.log(data)
      }
    } catch (err) {
      console.error('추천도서 불러오기 실패', err);
    }
  };

  const handleClick = (recommendId) => {
    navigate(`/publisher-recommend-detail?no=${recommendId}`);
  };

  return (
    <div className="publisher-recommend-section">
      <h2 className="publisher-recommend-title">📕 출판사에서 자신있게 추천해요</h2>

      {books.length === 0 ? (
        <div className="publisher-recommend-empty">추천 도서가 없습니다.</div>
      ) : (
        <div className="publisher-recommend-wrapper">
          <Swiper 
            key={books.length}  
            modules={[Navigation]} 
            spaceBetween={20} 
            slidesPerView={5} 
            navigation 
            className="publisher-recommend-swiper"
          >
            {books.map((book) => (
              <SwiperSlide key={book.id}>
                <div className="publisher-recommend-card" onClick={() => handleClick(book.id)} style={{ cursor: 'pointer' }}>
                  <img
                    src={book.defaultimg ?? '/default-image.png'}
                    alt={book.title}
                    className="publisher-recommend-image"
                    onError={(e) => { e.target.src = `/default-image.png`; }}
                  />
                  <div className="publisher-recommend-info">
                    <p className="publisher-recommend-title-text">{book.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                      {book.discount > 0 && (
                        <span style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '13px' }}>
                          {book.discount}% 할인
                        </span>
                      )}
                      <span style={{ textDecoration: book.discount > 0 ? 'line-through' : 'none', color: '#999', fontSize: '13px' }}>
                        {book.bookprice?.toLocaleString()}원
                      </span>
                    </div>
                    <div className="publisher-recommend-final-price">
                      {(book.bookprice * (100 - book.discount) / 100).toLocaleString()}원
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default PublisherRecommendSlide;
