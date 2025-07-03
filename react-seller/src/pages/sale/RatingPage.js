import React, { useEffect, useState } from 'react';
import { Card, Progress, Layout } from 'antd';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './css/RatingPage.css';

export default function RatingPage() {
  const location = useLocation();
  const { token } = useSelector((state) => state.LoginReducer);

  const [purchases, setPurchases] = useState([]);
  const reviewsFromState = location.state?.reviews;

  useEffect(() => {
    if (reviewsFromState) {
      setPurchases(reviewsFromState);
    } else {
      fetchReviews();
    }
  }, []);

  const fetchReviews = async () => {
    try {
      const url = `/api2/sorder/selectlist?page=1&cnt=100`; // 전체 조회 or 최근 N개
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.get(url, { headers });
      if (data.status === 1) {
        setPurchases(data.list);
      }
    } catch (error) {
      console.error('리뷰 불러오기 실패:', error);
    }
  };

  const ratedItems = purchases.filter(item => item.review?.evaluation != null);
  const averageRatingNum = ratedItems.length > 0
    ? (ratedItems.reduce((sum, item) => sum + item.review.evaluation, 0) / ratedItems.length).toFixed(1)
    : '0.0';

  return (
    <Layout className="rating-page-container">
      <div className="rating-page">
        <h2>나의 거래 평점</h2>
        <Card className="rating-card">
          <div className="rating-summary">
            <h3>평균 별점</h3>
            <div className="rating-value">{averageRatingNum} / 5.0</div>
            <Progress 
              percent={averageRatingNum * 20} 
              showInfo={false} 
              strokeColor="#faad14"
            />
          </div>
        </Card>
      </div>
    </Layout>
  );
}
