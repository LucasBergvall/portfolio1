// import React, { useEffect, useState, useRef } from 'react';
// import { Layout, Carousel, Card, Row, Col, Button } from 'antd';
// import {
//   HeartOutlined,
// } from '@ant-design/icons';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios'; // ✅ 추가

// import 'antd/dist/reset.css';
// import './SellerPage.css';

// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Pagination, Navigation } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';

// import banner11 from '../assets/book9.jpg'
// import banner10 from '../assets/book8.jpg'
// import Chat from './Chat';


// const { Header, Content, Footer } = Layout;
// const { Meta } = Card;

// export default function SellerPage() {
//   // 1. 변수
//   const navigate = useNavigate();
//   const [productList, setProductList] = useState([]); // ✅ 서버에서 받아올 목록
//   const [darkMode, setDarkMode] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [favorites, setFavorites] = useState({});
//   const [showMegaMenu, setShowMegaMenu] = useState(false);  
//   const toggleWrapperRef = useRef(null);
//   const { token, logged } = useSelector((state) => state.LoginReducer); 
//   const [page, setPage] = useState(1);
//   const [cnt, setCnt] = useState(20);
//   const [text, setText] = useState("");
//   const [genrelist, setGenrelist] = useState([]);

//   // 2. 이펙트

//   useEffect(() => {
//     if (logged === 1) {
//       setIsLoggedIn(true)
//       // ✅ 토큰 포함하여 실제로 사용하는 요청
//       loggedin();
//     }
//     else {
//       notlogged();
//     } 
//     genre();
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (toggleWrapperRef.current && !toggleWrapperRef.current.contains(event.target)) {
//         setShowMegaMenu(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);


//   useEffect(() => {
    
//   }, [productList]);

//   // 3. 함수

//   const genre = async() => {
//     const url = `/api2/genre/selectitemlist`
//     const { data } = await axios.get(url);
//     console.log(data);
//     if(data.status === 1) {
//       setGenrelist(data.list);
//     }
//   }


//   // 로그인 하지 않았을때 책 목록
//   const notlogged = async() => { 
//     const {data} = await axios.get(`/api2/item/selectitemlist?page=${page}&cnt=${cnt}&text=${text}`)
//     console.log(data);
//     if(data.status === 1) {
//       setProductList(data.list)
//     }
//   };



//   const loggedin = async() => {
//     try {
//       const url = `/api2/item/selectlist?page=${page}&cnt=${cnt}&text=${text}`;
//       const headers = { Authorization: `Bearer ${token}` }
//       const {data} = await axios.get(url, { headers });
//       console.log(data)

//       if (data.status === 1) {
//           setProductList(data.list);
//       } else {
//           console.error('상품 목록 로드 실패', data.message);
//       }
//     } catch (err) {
//       console.error('서버 에러', err);
//     }
//   }
  


//   const getGenre = async(gno) => {
//     const url = `api2/item/genrelist?gno=${gno}&page=${page}&cnt=${cnt}`
//     const headers = { Authorization: `Bearer ${token}` }
//     const {data} = await axios.get(url, { headers });
//     console.log(data);

//     if (data.status === 1) {
//           setProductList(data.list);
//       } else {
//           console.error('상품 목록 로드 실패', data.message);
//       }
//   }


 

//   const handleAddToFavorites = (productId) => {
//     setFavorites((prev) => {
//       const updated = { ...prev, [productId]: !prev[productId] };
//       return updated;
//     });
//   };

//   const handleViewMore = (productNo) => {
//     navigate(`/item/detail?no=${productNo}`);
//   };

//   return (
//     <Layout className={darkMode ? 'dark-mode' : ''}>
//       <Content style={{ padding: '24px 50px' }}>
//        <Row gutter={[16, 16]} className="banner-row">
//           {/* 왼쪽 큰 배너 (Carousel) */}
//           <Col xs={24} md={16}>
//             <Swiper
//               modules={[Autoplay, Pagination]}
//               spaceBetween={30}
//               slidesPerView={1}
//               loop
//               autoplay={{ delay: 4000 }}
//               pagination={{ clickable: true }}
//               className="main-swiper"
//             >
//               <SwiperSlide>
//                 <img
//                   src="https://contents.kyobobook.co.kr/display/i_890_380_59102ee30c304b9f874e4a702deebd5b.jpg"
//                   alt="[sam 정기] 북모닝 이달의 도서"
//                   className="main-banner-img"
//                 />
//               </SwiperSlide>
//               <SwiperSlide>
//                 <img
//                   src="https://contents.kyobobook.co.kr/display/i_890_380_c43e2f1d637b4955ae183c7802045216.jpg"
//                   alt="[sam] sam 상반기 결산전 (feat.서울국제도서전)"
//                   className="main-banner-img"
//                 />
//               </SwiperSlide>
//               <SwiperSlide>
//                 <img
//                   src="https://contents.kyobobook.co.kr/display/i_890_380_01b82c2acee14c45bc3c005447cd47ad.jpg"
//                   alt="EBS 다큐프라임"
//                   className="main-banner-img"
//                 />
//               </SwiperSlide>
//               <SwiperSlide>
//                 <img
//                   src="https://contents.kyobobook.co.kr/display/i_890_380-001_cc2d66b670904b60afa09ec83ad94a20.jpg"
//                   alt="세계 몬스터 도감"
//                   className="main-banner-img"
//                 />
//               </SwiperSlide>
//             </Swiper>
//           </Col>

//           {/* 오른쪽 작은 배너 (배너 여러 개) */}
//           <Col xs={24} md={8}>
//             <Carousel autoplay autoplaySpeed={4000} className="side-carousel">
//               <div>
//                 <img src={banner10} alt="사이드배너1" className="side-banner-img" />
//               </div>
//               <div>
//                 <img src={banner11} alt="사이드배너2" className="side-banner-img" />
//               </div>
//             </Carousel>
//           </Col>
//         </Row>

//         <div className="genre-button-group">
//           {genrelist.map((genre, index) => (
//             <Button
//               key={index}
//               type="primary"
//               onClick={() => getGenre(genre.no)}
//               className="genre-btn"
//             >
//               {genre.genre_name}
//             </Button>
//           ))}
//         </div>
        
//         <div className="product-grid-wrapper">
//           <Row gutter={[16, 24]} justify="start">
//             {productList.map(product => (
//               <Col key={product.no} xs={24} sm={12} md={8} lg={6} xl={6}>
//                 <Card className="product-card" hoverable
//                   onClick={() => handleViewMore(product.no)}
//                   style={{ borderRadius: '8px', width: '100%' }}
//                 >
//                   <div className="product-image" onClick={() => handleViewMore(product.no)} style={{ cursor: 'pointer' }}>
//                     <img src={product.default_img_url} alt={product.title} />
//                   </div>
//                   <div className="product-content">
//                    <Meta
//                     title={product.title}
//                     description={
//                       product.price != null ? (
//                         <div>
//                           {/* 원래 가격 */}
//                           <span style={{ textDecoration: 'line-through', marginRight: '8px', color: '#999' }}>
//                             {product.price.toLocaleString()}
//                             {product.type === 'book' ? '원' : '$'}
//                           </span>

//                           {/* 할인된 가격 */}
//                           <span style={{ fontWeight: 'bold', color: '#ff4d4f', marginRight: '8px' }}>
//                             {Math.floor(product.price * (1 - product.discount / 100)).toLocaleString()}
//                             {product.type === 'book' ? '원' : '$'}
//                           </span>

//                           {/* 할인율 문구 */}
//                           <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
//                             ({product.discount}% 할인)
//                           </span>
//                         </div>
//                       ) : (
//                         `할인율: ${product.discount}%`
//                       )
//                     }
//                   />

//                     <div className="product-card-buttons">
//                       <Button
//                         className="like-btn"
//                         type="primary"
//                         icon={favorites[product.id] ? <HeartOutlined style={{ color: 'red' }} /> : <HeartOutlined />}
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleAddToFavorites(product.id);
//                         }}
//                       >
//                         {favorites[product.id] ? '찜 취소' : '찜하기'}
//                       </Button>

//                       <Button
//                         className="more-btn"
//                         type="primary"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleViewMore(product.id);
//                         }}
//                       >
//                         More
//                       </Button>
//                     </div>
//                   </div>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </div>
//       </Content>

//       <Footer style={{ textAlign: 'center', background: '#F7C600' }}>공구마켓 판매자 페이지©2025</Footer>
//       <Chat />
//     </Layout>
//   );
// }

import React, { useEffect, useState, useRef } from 'react';
import { Layout, Carousel, Card, Row, Col, Button, message } from 'antd';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'antd/dist/reset.css';
import './SellerPage.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import banner11 from '../assets/book9.jpg';
import banner10 from '../assets/book8.jpg';
import Chat from './Chat';
import CustomFooter from './footer/CustomFooter';

const { Content, Footer } = Layout;

export default function SellerPage() {
  const navigate = useNavigate();
  const { token, logged } = useSelector((state) => state.LoginReducer); 
  const [productList, setProductList] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [genrelist, setGenrelist] = useState([]);
  const [page, setPage] = useState(1);
  const [cnt, setCnt] = useState(20);
  const [text, setText] = useState("");

  useEffect(() => {
    if (logged === 1) {
      loadLoggedInItems();
      loadFavorites();
    } else {
      loadNotLoggedInItems();
    }
    loadGenres();
  }, []);

  const loadGenres = async () => {
    const url = `/api2/genre/selectitemlist`;
    const { data } = await axios.get(url);
    if (data.status === 1) {
      console.log(data);
      setGenrelist(data.list);
    }
  };

  const loadNotLoggedInItems = async () => {
    const { data } = await axios.get(`/api2/item/selectitemlist?page=${page}&cnt=${cnt}&text=${text}`);
    if (data.status === 1) {
      setProductList(data.list);
    }
  };

  const loadLoggedInItems = async () => {
    try {
      const url = `/api2/item/selectlist?page=${page}&cnt=${cnt}&text=${text}`;
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.get(url, { headers });
      if (data.status === 1) {
        console.log(data);
        setProductList(data.list);
      }
    } catch (err) {
      console.error('서버 에러', err);
    }
  };

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
      console.error("찜 목록 불러오기 실패:", err);
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
      console.error(err);
      message.error('에러 발생: ' + err.message);
    }
  };

  const handleAddToCart = async (itemNo) => {
    if (!token) {
      message.info("로그인이 필요합니다.");
      navigate('/login');
      return;
    }
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = { item: { no: itemNo } };
      const { data } = await axios.post(`/api2/cart/insert`, body, { headers });
      if (data.status === 1) {
        message.success('장바구니 담기 완료');
      }
    } catch (error) {
      console.error(error);
      message.error('에러 발생');
    }
  };

  const handleViewMore = (productNo) => {
    navigate(`/item/detail?no=${productNo}`);
  };

  const getGenre = async(gno) => {
    const url = `api2/item/genrelist?gno=${gno}&page=${page}&cnt=${cnt}`
    const headers = { Authorization: `Bearer ${token}` }
    const {data} = await axios.get(url, { headers });
    console.log(data);

    if (data.status === 1) {
        console.log(data);
        setProductList(data.list);
      } else {
          console.error('상품 목록 로드 실패', data.message);
      }
  }

  return (
    <Layout>
      <Content style={{ padding: '24px 50px' }}>
         <div className="seller-genre-button-group">
          <Button
            type="primary"
            onClick={() => {
              if (logged === 1) {
                loadLoggedInItems();
              } else {
                loadNotLoggedInItems();
              }
            }}
            className="genre-btn"
          >
            전체 상품
          </Button>
         {genrelist.map((genre, index) => (
            <Button
              key={index}
              type="primary"
              onClick={() => getGenre(genre.no)}
              className="genre-btn"
            >
              {genre.genreName}
            </Button>
          ))}
        </div>

        <div className="seller-product-section">
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
                    <div className="seller-product-image-wrapper">
                      <img src={product.default_img_url} alt={product.title} className="product-image" />
                    </div>

                    <div className="seller-card-body-content">
                      <div className="seller-book-info">
                        <h3 className="seller-book-title">{product.title}</h3>
                        <div className='seller-genre'>장르 : {product.genreName}</div>
                        <div className='selelr-writer'>작가: {product.writer}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {product.discount > 0 && (
                            <span style={{ color: 'red', fontWeight: 'bold' }}>{product.discount}% 할인</span>
                          )}
                          <span style={{ textDecoration: product.discount > 0 ? 'line-through' : 'none', color: '#999' }}>
                            {product.bookprice?.toLocaleString()}원
                          </span>
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>
                          {(product.bookprice * (100 - product.discount) / 100).toLocaleString()}원
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>
      </Content>
      <Chat />
      <CustomFooter />
    </Layout>
  );
}

