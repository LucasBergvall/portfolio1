// src/pages/ItemDetailSellerPage.js
import React from 'react';
import { Card, Button, Row, Col, Statistic, Image, Divider, Tabs, List, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, HeartOutlined } from '@ant-design/icons';
import './ItemDetailSellerPage.css'

const { TabPane } = Tabs;

const dummyItem = {
  title: '소녀가 온다',
  price: 19.73,
  stock: 120,
  image: '/assets/book.jpg',
  likes: 87,
  views: 412,
  sales: 57,
  description: '한강의 장편소설. 잊혀지지 않는 이야기.',
  reviews: [
    { id: 1, user: 'user1', content: '좋은 책이에요!', rating: 5 },
    { id: 2, user: 'user2', content: '감동적이었습니다.', rating: 4 },
  ],
};

export default function ItemDetailSellerPage() {
  const handleEdit = () => {
    message.info('수정 페이지로 이동합니다.');
  };

  const handleDelete = () => {
    Modal.confirm({
      title: '상품 삭제',
      content: '정말로 이 상품을 삭제하시겠습니까?',
      onOk: () => {
        message.success('상품이 삭제되었습니다.');
        // 삭제 처리 로직 추가
      },
    });
  };

  return (
   <div className="item-detail-container">
    <Card className="item-card">
      <Row gutter={24}>
        <Col span={8}>
          <Image width="100%" src={dummyItem.image} />
        </Col>
        <Col span={16}>
          <h2 className="item-title">{dummyItem.title}</h2>
          <p className="item-description">{dummyItem.description}</p>
          <Divider />
          <Row gutter={16}>
            <Col span={12}>
              <Statistic title="가격" value={dummyItem.price} suffix="$" />
            </Col>
            <Col span={12}>
              <Statistic title="재고" value={dummyItem.stock} />
            </Col>
          </Row>
          <div className="item-buttons">
            <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>상품 수정</Button>
            <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>상품 삭제</Button>
          </div>
        </Col>
      </Row>
    </Card>


      <div className="item-tabs">
        <Tabs defaultActiveKey="1">
          <TabPane tab="리뷰 관리" key="1">
            <List
              dataSource={dummyItem.reviews}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={`${item.user} (⭐ ${item.rating})`}
                    description={item.content}
                  />
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="판매 통계" key="2">
            <Statistic title="누적 판매량" value={dummyItem.sales} suffix="권" />
            {/* 필요시 월별 그래프 등 추가 */}
          </TabPane>
          <TabPane tab="배송/옵션 정보" key="3">
            <p>기본 배송비: 3,000원</p>
            <p>배송 소요 시간: 2~3일</p>
            <p>옵션: 표지 색상 - 흰색 / 검정</p>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}
