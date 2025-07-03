import React, { useEffect, useRef, useState } from 'react';
import './css/BuyHistory.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Content } from 'antd/es/layout/layout';
import { Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';

const BuyHistory = () => {
  const { token } = useSelector((state) => state.LoginReducer);
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(1);
  const [cnt, setCnt] = useState(20);
  const [loading, setLoading] = useState(false);
  const [scrollTrigger, setScrollTrigger] = useState(1);
  const previousTriggerRef = useRef(Math.floor(scrollTrigger));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // 페이지에 처음 진입할 때 한 번 dispatch 실행
    dispatch({ type: 'mypage_menu', idx: "5" });
  }, [dispatch]);

  useEffect(() => {
    loadPurchasedItem();
  }, [token, page]);

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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  useEffect(() => {
    const current = Math.floor(scrollTrigger);
    const prev = previousTriggerRef.current;
    if (current > prev) {
      previousTriggerRef.current = current;
      setPage(current);
      console.log("페이지 증가! →", current);
    }
  }, [scrollTrigger]);

  const loadPurchasedItem = async () => {
    const url = `/api2/buyorder/selectlist?page=${page}&cnt=${cnt}`;
    const headers = { Authorization: `Bearer ${token}` };
    const { data } = await axios.get(url, { headers });
    console.log(data);
    if (data.status === 1) {
      setProductList(prev => [...prev, ...data.list]);
    }
  };

  // BuyHistory → 클릭 시 navigate 넘길 때 주문번호 넘김
 const handleCardClick = async (item) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get(`/api2/review/exists?phano=${item.no}`, { headers });

      if (res.data.status === 1) {
        if (res.data.exists) {
          console.log(res.data);
          alert("이미 리뷰를 작성한 상품입니다.");
        } else {
          navigate('/mypage/review-write', { state: { orderNo: item.no } });
        }
      } else {
        alert("리뷰 중복 확인 실패");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류 발생");
    }
  };

  return (
    <Content className="border-content">
      <h2 className="border-title">📚 구매목록 </h2>
      <Row gutter={[16, 24]} justify="start">
        {productList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '20px' }}>
            로딩중입니다...
          </div>
        ) : (
          productList.map(item => {
            const title = item.item?.title ?? '제목없음';
            const bookprice = item.item?.bookprice ?? 0;
            const discount = item.item?.itemBook?.discount ?? 0;
            const quantity = item.quantity ?? 1;
            const imgUrl = item.item?.default_img_url ?? '/default-image.png';
            const totalPrice = Math.floor((bookprice - (bookprice * (discount / 100))) * quantity);

            return (
              <Col key={item.no} xs={24} sm={12} md={8} lg={6}>
                <div className="border-card">
                  <div className="border-image-wrapper">
                    <img src={imgUrl} alt={title} className="border-image" onClick={() => handleCardClick(item)}/>
                  </div>
                  <div className="border-info">
                    <h3 className="border-book-title">{title}</h3>
                    <div className="border-final-price">수량: {quantity}개</div>
                    <div className="border-final-price">
                      총 결제금액: {totalPrice.toLocaleString()}원
                    </div>
                  </div>
                </div>
              </Col>
            )
          })
        )}
      </Row>
    </Content>
  );
};

export default BuyHistory;
