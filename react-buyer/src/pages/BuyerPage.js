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
import PublisherRecommendSlide from './recommend/PublisherRecommendSlide';
import MdRecommendSlide from './recommend/MdRecommendSlide';
import CustomFooter from './footer/CustomFooter';
import MegaDropDown from './megaDropDown/MegaDropDown';

const { Content, Footer } = Layout;

export default function BuyerPage() {

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

  // 사이드 배너 데이터 배열화
  const sideBanners = [
    {
      img: "https://contents.kyobobook.co.kr/display/250618%20최저가%20배너2_b859b560fd99443fa0656b03b5776471.jpg",
      title: "엑스트라 무선 멀티 선풍기",
      price: "19,800원",
      link: "https://hottracks.kyobobook.co.kr/ht/hot/hotdealMain"
    },
    {
      img: "https://contents.kyobobook.co.kr/display/250618%20최저가%20배너3_942237eaf25e4ba78465f8445207a7cb.jpg",
      title: "[1+1] 오르템 풋 필링 크림",
      price: "7,900원",
      link: "https://hottracks.kyobobook.co.kr/ht/hot/hotdealMain"
    },
    {
      img: "https://contents.kyobobook.co.kr/display/250618%20최저가%20배너1_3bf47b6334d44d45beb18981cadebdad.jpg",
      title: "리르 힐 케어 풋 버퍼",
      price: "3,900원",
      link: "https://hottracks.kyobobook.co.kr/ht/hot/hotdealMain"
    }
  ];

  return (
    <Layout className={darkMode ? 'dark-mode' : ''}>
      <Content style={{ padding: '0' }}>
        <Row gutter={[16, 16]} className="banner-row">
          {/* 왼쪽 큰 배너 (Carousel) */}
          <Col xs={24} md={16}>
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              loop
              autoplay={{ delay: 4000 }}
              pagination={{ clickable: true }}
              className="main-swiper"
            >
              <SwiperSlide>
                <img
                  src="https://contents.kyobobook.co.kr/display/i_890_380_59102ee30c304b9f874e4a702deebd5b.jpg"
                  alt="배너1"
                  className="main-banner-img"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://contents.kyobobook.co.kr/display/i_890_380_c43e2f1d637b4955ae183c7802045216.jpg"
                  alt="배너2"
                  className="main-banner-img"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://contents.kyobobook.co.kr/display/i_890_380_01b82c2acee14c45bc3c005447cd47ad.jpg"
                  alt="배너3"
                  className="main-banner-img"
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  src="https://contents.kyobobook.co.kr/display/i_890_380-001_cc2d66b670904b60afa09ec83ad94a20.jpg"
                  alt="배너4"
                  className="main-banner-img"
                />
              </SwiperSlide>
            </Swiper>
          </Col>

          {/* 오른쪽 사이드 배너 */}
          {/* 오른쪽 사이드 배너 Swiper */}
          <Col xs={24} md={8}>
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              loop
              autoplay={{ delay: 4000 }}
              navigation
              className="side-carousel"
            >
              {sideBanners.map((item, idx) => (
                <SwiperSlide key={idx}>
                  <div className="side-banner-item" style={{ position: 'relative', height: '380px' }}
                       onClick={() => window.open(item.link, '_blank')}>
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '16px'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        padding: '12px',
                        textAlign: 'center',
                        borderBottomLeftRadius: '16px',
                        borderBottomRightRadius: '16px'
                      }}
                    >
                      <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                        오늘만 특가<br />{item.title}
                      </p>
                      <span>[무료배송] 오늘만 이 가격 {item.price}!</span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
        </Row>

        <BestSellerSlide />

        {/* 👉 광고 추천 배너 섹션 */}
        <div className="recommend-banner-wrapper">
          <div className="recommend-banner-section">           
            {/* 첫번째 배너 */}
            <div 
              className="recommend-banner"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/item/item-detail?no=91`)}
            >
              <img 
                src="https://contents.kyobobook.co.kr/advrcntr/IMAC/creatives/2025/06/12/47983/welcome_main.jpg" 
                alt="고독한 용의자"
                className="recommend-banner-image"
              />
            </div>

            {/* 두번째 배너 */}
            <div 
              className="recommend-banner"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/item/item-detail?no=90`)}
            >
              <img 
                src="https://contents.kyobobook.co.kr/advrcntr/IMAC/creatives/2025/06/13/74480/my25_wm_0616.png" 
                alt="내게 남은 스물다섯 번의 계절"
                className="recommend-banner-image"
              />
            </div>
          </div>
        </div>
        <PublisherRecommendSlide />
        <MdRecommendSlide />

        {/* 광고 배너 - Footer 바로 위 */}
        <div className="main-bottom-ad-banner" style={{ margin: '40px auto', maxWidth: '1200px', textAlign: 'center' }}>
          <img
            src="https://contents.kyobobook.co.kr/advrcntr/IMAC/creatives/2025/06/20/74480/KakaoTalk_20250620_103856631.png"
            alt="네 명의 억만장자와 한 명의 주차관리원"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '16px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              cursor: 'pointer'
            }}
            onClick={() => navigate(`/item/item-detail?no=104`)}
          />
        </div>
      </Content>
      <CustomFooter />
      <Chat />
      <MegaDropDown />
    </Layout>
  );
}
