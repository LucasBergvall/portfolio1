import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import axios from 'axios';
import './css/MdRecommendSlide.css';
import { useNavigate } from 'react-router-dom';

const MdRecommendSlide = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMdRecommendBooks();
  }, []);

  const fetchMdRecommendBooks = async () => {
    try {
      const { data } = await axios.get(encodeURI('/api2/mdrecommend/group/MD추천'));
      console.log(data);
      if (data.status === 1) {
        setBooks(data.list);
      }
    } catch (err) {
      console.error('MD 추천도서 불러오기 실패', err);
    }
  };

  const handleClick = (recommendId) => {
    navigate(`/mdrecommend-detail?no=${recommendId}`);
  };

  return (
    <div className="md-recommend-section">
      <h2 className="md-recommend-title">🧡 MD들이 신중하게 골랐어요</h2>

      {books.length === 0 ? (
        <div className="md-recommend-empty">추천 도서가 없습니다.</div>
      ) : (
        <div className="md-recommend-wrapper">
          <Swiper 
            key={books.length}  
            modules={[Navigation]} 
            spaceBetween={20} 
            slidesPerView={5} 
            navigation 
            className="md-recommend-swiper"
          >
            {books.map((book) => (
              <SwiperSlide key={book.id}>
                <div className="md-recommend-card" onClick={() => handleClick(book.id)} style={{ cursor: 'pointer' }}>
                  <img
                    src={book.defaultimg ?? '/default-image.png'}
                    alt={book.title}
                    className="md-recommend-image"
                    onError={(e) => { e.target.src = `/default-image.png`; }}
                  />
                  <div className="md-recommend-info">
                    <p className="md-recommend-title-text">{book.title}</p>
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
                    <div className="md-recommend-final-price">
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

export default MdRecommendSlide;
