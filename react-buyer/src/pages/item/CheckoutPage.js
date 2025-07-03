import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, Divider, InputNumber, Space, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './css/CheckoutPage.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography;

export default function CheckoutPage() {
  // 1. 변수
  const { token } = useSelector(state => state.LoginReducer);
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems = [], totalPrice = 0 } = location.state || {};
  const [items, setItems] = useState(cartItems);
  console.log(items);

  // 2. 총 금액 계산 (항상 최신 items 기반으로 계산)
  const total = Array.isArray(items)
    ? items.reduce((sum, item) => sum + (item.bookprice * item.quantity), 0)
    : 0;

  // 3. 수량 변경 핸들러
  const handleQuantityChange = (itemNo, newQuantity) => {
    setItems(prev =>
      prev.map(item =>
        item.itemNo === itemNo ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 4. 삭제 핸들러
  const handleRemove = (itemNo) => {
    setItems(prev => prev.filter(item => item.itemNo !== itemNo));
    message.success('상품이 삭제되었습니다.');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // 5. 결제하기 클릭 (실제 결제처리 API 호출 부분은 아직 생략)
  const handleCheckout = async() => {
    if (items.length === 0) {
      message.warning("선택된 상품이 없습니다.");
      return;
    }
    const cartNoList = cartItems.map(item => item.cartNo);
    console.log(cartNoList);  // 👉 [8, 2]
    const url = `/api2/pay/ready`
    const headers = { Authorization: `Bearer ${token}` };
    const { data } = await axios.post(url, cartNoList, {headers})
    console.log(data);
    if(data.status === 1) {
      window.location.href = data.message.next_redirect_pc_url;
    }
    
    // message.success("결제가 완료되었습니다!");
    // navigate('/');
  };

  return (
    <div className="checkout-page">
      <Title level={2}>🧾 결제 페이지</Title>
      <Divider />

      {items.length === 0 ? (
        <Text>선택한 상품이 없습니다.</Text>
      ) : (
        <>
          <Row gutter={[16, 16]} className="checkout-items">
            {items.map((item) => {
              console.log("item.imgDefault:", item.imgDefault);
              return (
                <Col xs={24} sm={12} md={8} key={item.itemNo}>
                  <Card
                    className="checkout-item-card"
                    hoverable
                    cover={
                     <img
                        alt={item.title}
                        src={item.imgDefault ? item.imgDefault : '/default-image.png'}
                        onError={(e) => e.target.src = '/default-image.png'}
                      />
                    }
                  >
                    <Card.Meta 
                      title={<Text strong>{item.title}</Text>} 
                      description={`수량: ${item.quantity}개`} 
                    />
                    <div style={{ marginTop: '8px' }}>
                      <Text type="secondary">
                        소계: {(item.bookprice * item.quantity).toLocaleString()}원
                      </Text>
                    </div>

                    <div style={{ marginTop: '12px', textAlign: 'right' }}>
                      <Space>
                        <InputNumber
                          min={1}
                          max={99}
                          value={item.quantity}
                          onChange={(value) => handleQuantityChange(item.itemNo, value || 1)}
                        />
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemove(item.itemNo)}
                        >
                          삭제
                        </Button>
                      </Space>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        <Divider />

          <div className="checkout-total">
            <Title level={4}>총 결제 금액: {total.toLocaleString()}원</Title>
            <div className="checkout-buttons">
              <Button type="default" onClick={handleGoBack}>돌아가기</Button>
              <Button type="primary" onClick={handleCheckout}>결제하기</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
