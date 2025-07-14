// src/pages/RatingPage.js
import React from 'react';
import { Card, Progress, Menu, Layout } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, FileTextOutlined, ShoppingCartOutlined, CloudUploadOutlined, FileSearchOutlined, CloudServerOutlined } from '@ant-design/icons';
import './css/AvgRating.css';

export default function AvgRating({ purchases = [] }) {
  const ratedItems = purchases.filter(item => item.rated);
  const averageRating = ratedItems.length > 0
    ? (ratedItems.reduce((sum, item) => sum + item.rating, 0) / ratedItems.length).toFixed(2)
    : 0;

  const { Sider } = Layout

  return (
    <Layout className='rating-page-container'>
      <div className="rating-page">
        <h2>거래 평점</h2>
        <Card className="rating-card">
          <div className="rating-summary">
            <h3>나의 평균 평점</h3>
            <div className="rating-value">{averageRating} / 5.0</div>
            <Progress 
              percent={averageRating * 20} 
              showInfo={false} 
              strokeColor="#faad14"
            />
          </div>

          <div className="rating-detail">
            {ratedItems.length > 0 ? (
              ratedItems.map(item => (
                <div key={item.id} className="rating-item">
                  <strong>{item.title}</strong>
                  <span> ⭐ {item.rating}점 - {item.comment}</span>
                </div>
              ))
            ) : (
              <p>아직 등록된 평점이 없습니다.</p>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
}
