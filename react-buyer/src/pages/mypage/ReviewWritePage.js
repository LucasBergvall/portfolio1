import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/ReviewWritePage.css';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom'; // ✅ useNavigate 추가

export default function ReviewWritePage() {
  const location = useLocation();
  const orderNo = location.state?.orderNo;
  const navigate = useNavigate();  // ✅ 여기 추가

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [orderData, setOrderData] = useState(null);
  const { token } = useSelector(state => state.LoginReducer);

  useEffect(() => {
    if (!orderNo) return;
    loadOrderDetail(orderNo);
  }, [orderNo]);

  const loadOrderDetail = async (orderNo) => {
    const url = `/api2/buyorder/select?no=${orderNo}`;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const { data } = await axios.get(url, { headers });

      if (data.status === 1) {
        console.log(data);
        setOrderData(data.order);
      } else {
        alert(data.message); // ✅ 백엔드 메시지 그대로 출력
        navigate('/mypage/review-list'); // ✅ 실패 시 목록으로 되돌림
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류 발생");
      navigate('/mypage/review-list'); // 오류 시도 되돌림 처리
    }
  };

  const handleSubmit = async () => {
    if (!orderData) {
      alert("주문정보가 없습니다");
      return;
    }

    const reviewData = {
      review: reviewText,
      evaluation: rating
    };

    const reviewActionData = {
      paymentHistoryAction: { no: orderData.paymentHistoryActionNo }
    };
    console.log("orderData 구조:", orderData);

    const formData = new FormData();
    formData.append("review", new Blob([JSON.stringify(reviewData)], { type: "application/json" }));
    formData.append("reviewaction", new Blob([JSON.stringify(reviewActionData)], { type: "application/json" }));

    try {
      const res = await axios.post("/api2/review/insert", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.status === 1) {
        alert("리뷰 등록 성공!");
        navigate('/mypage/review-list');  // ✅ 이동
      }
      else alert("리뷰 등록 실패: " + res.data.message);
    } catch (err) {
      console.error(err);
      alert("서버 오류 발생");
    }
  };

  return (
    <div className="review-container">
      <h2>리뷰 작성</h2>

      {orderData && (
        <div className="item-info">
          <img src={orderData.item?.default_img_url} alt={orderData.item?.title} />
          <h3>{orderData.item?.title}</h3>
          <p>수량: {orderData.quantity}개</p>
          <p>총 결제금액: {(orderData.item.bookprice * orderData.quantity).toLocaleString()}원</p>
        </div>
      )}

      <textarea
        className="review-textarea"
        placeholder="리뷰 내용을 작성하세요"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />

      <div className="star-rating">
        {[1, 2, 3, 4, 5].map(num => (
          <span
            key={num}
            onClick={() => setRating(num)}
            style={{ color: rating >= num ? 'gold' : '#ccc' }}
          >★</span>
        ))}
      </div>

      <button className="submit-button" onClick={handleSubmit}>리뷰 등록</button>
    </div>
  );
}
