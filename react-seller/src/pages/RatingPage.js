// src/pages/RatingPage.js
import React from 'react';
import { Card, Progress, Menu, Layout } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, FileTextOutlined, ShoppingCartOutlined, CloudUploadOutlined, FileSearchOutlined, CloudServerOutlined } from '@ant-design/icons';
import './RatingPage.css';

export default function RatingPage({ purchases = [] }) {
  const ratedItems = purchases.filter(item => item.rated);
  const averageRating = ratedItems.length > 0
    ? (ratedItems.reduce((sum, item) => sum + item.rating, 0) / ratedItems.length).toFixed(2)
    : 0;

  const { Sider } = Layout

  return (
    <Layout className='rating-page-container'>
      {/* 사이드바 */}
      <Sider width={250} style={{ background: '#f0f2f5', height: '100vh', paddingTop: '20px' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['7']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<UserOutlined />}><Link to="/profile">회원정보 관리</Link></Menu.Item>
          <Menu.Item key="2" icon={<FileTextOutlined />}><Link to="/salehistory">판매내역</Link></Menu.Item>
          <Menu.Item key="3" icon={<ShoppingCartOutlined />}><Link to="/item-register">등록한 상품</Link></Menu.Item>
          <Menu.Item key="4" icon={<CloudUploadOutlined />}><Link to="/item-register-form/tool">공구 등록</Link></Menu.Item>
          <Menu.Item key="5" icon={<CloudServerOutlined />}><Link to="/item-register-form/inverter">인버터 등록</Link></Menu.Item>
          <Menu.Item key="6" icon={<FileSearchOutlined />}><Link to="/address">배송주소 관리</Link></Menu.Item>
          <Menu.Item key="7" icon={<FileSearchOutlined />}><Link to="/ratingpage">나의 평점</Link></Menu.Item>
        </Menu>
      </Sider>
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
