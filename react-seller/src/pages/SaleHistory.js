// src/pages/SaleHistory.js
import React from 'react';
import { Card, List, Button, Rate, Layout, Menu } from 'antd';
import { useNavigate, Link } from 'react-router-dom';  // 페이지 이동을 위해 추가
import './SaleHistory.css';
import { ShoppingCartOutlined, UserOutlined, FileTextOutlined, FileSearchOutlined, CloudUploadOutlined, CloudServerOutlined } from '@ant-design/icons';


export default function SaleHistory() {
  // 임시 데이터 (실제 데이터로 대체 필요)
  const saleData = [
    { id: 1, title: 'Node.js 심화', date: '2025-03-15', price: 18000, rating: 4, comment: '좋은 책이에요!' },
    { id: 2, title: 'Docker와 Kubernetes', date: '2025-02-28', price: 25000, rating: 5, comment: '아주 유익한 강의!' },
  ];

  const navigate = useNavigate();  // 페이지 이동을 위한 navigate 사용

  const goToRatingPage = () => {
    navigate('/ratingpage');  // '나의 평점 페이지'로 이동
  };

  const { Content, Sider } = Layout;

  return (
    <Layout className='salehistory-container'>
      {/* 사이드바 */}
        <Sider width={250} style={{ background: '#f0f2f5', height: '100vh', paddingTop: '20px' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['2']}
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
      <div className="sale-history">
        <h2>판매 내역</h2>
        <Card>
          <List
            itemLayout="horizontal"
            dataSource={saleData}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                  description={`판매일: ${item.date} | 가격: ${item.price.toLocaleString()}원`}
                />
                {/* 다른 사람들이 남긴 평점 표시 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Rate disabled value={item.rating} />
                  <span style={{ fontSize: '12px', color: 'gray' }}>{item.comment}</span>
                </div>
              </List.Item>
            )}
          />
        </Card>

        {/* '나의 평점 페이지'로 이동하는 버튼 */}
        <Button
          block
          className="salehistory-btn"
          style={{ marginTop: 16 }}
          onClick={() => navigate('/ratingpage')}
        >
          나의 평점 페이지로 이동
        </Button>
      </div>
    </Layout>
  );
}
