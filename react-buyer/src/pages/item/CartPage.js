import React, { useState, useEffect } from 'react'
import { InputNumber, Button, Typography, Card, Row, Col, Divider, Layout, message, Checkbox } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import './css/CartPage.css'
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { Title, Text } = Typography
const { Content } = Layout

export default function CartPage() {
  
  // 1. 변수
  const { token } = useSelector(state => state.LoginReducer);
  const [groupedCartItems, setGroupedCartItems] = useState({});
  const navigate = useNavigate();
  const [showHeader, setShowHeader] = useState(true);
  const [page, setPage] = useState(1);
  const [cnt, setCnt] = useState(20);
  const [selectedItems, setSelectedItems] = useState({});

  // 2. 이펙트
  useEffect(() => {
    if(token) loadCartItems();
  }, [token]);

  useEffect(() => {
    const handleScroll = () => setShowHeader(window.scrollY < 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. 함수 

  const selectedTotalPrice = Object.values(selectedItems)
  .flatMap(sellerItems => Object.values(sellerItems))
  .reduce((sum, item) => sum + (item.bookprice * item.quantity), 0);

  // 체크박스 상태 업데이트
  const handleSelectItem = (seller, itemNo, checked, item) => {
    setSelectedItems(prev => {
      const sellerItems = prev[seller] || {};
      if (checked) {
        return { ...prev, [seller]: { ...sellerItems, [itemNo]: item } };
      } else {
        const updatedSellerItems = { ...sellerItems };
        delete updatedSellerItems[itemNo];
        const updated = { ...prev, [seller]: updatedSellerItems };
        if (Object.keys(updated[seller]).length === 0) {
          delete updated[seller];
        }
        return updated;
      }
    });
  };

  // 새로고침 혹은 새로 로그인 시 카트 물품 유지
  const loadCartItems = async () => {
    if (!token) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const url = `/api2/cart/selectlist?page=${page}&cnt=${cnt}`;
      const { data } = await axios.get(url, { headers });
      console.log(data);

      if (data.status === 1) {
        setGroupedCartItems(data.list);
      }
    } catch (err) {
      console.error("장바구니 로딩 실패:", err);
    }
  }

  // 수량 변경 (판매자 그룹 안에서 찾아서 수정)
  const handleQuantityChange = async (seller, itemNo, newQuantity, cartNo) => {
    console.log("👉 수량변경 호출:", { seller, itemNo, newQuantity, cartNo });

    // 1. 상태 업데이트 (UI 즉시 반영)
    setGroupedCartItems(prev => {
      const updatedSellerItems = prev[seller].map(item =>
        item.itemNo === itemNo ? { ...item, quantity: newQuantity } : item
      );
      console.log("👉 상태 업데이트 결과:", updatedSellerItems);
      return { ...prev, [seller]: updatedSellerItems };
    });

    // 2. DB 반영
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        no: cartNo,
        quantity: newQuantity
      };

      console.log("👉 서버 전송 데이터:", body);

      const res = await axios.put('/api2/cart/update', body, { headers });

      console.log("👉 서버 응답:", res.data);

      if (res.data.status === 1) {
        message.success('수량이 변경되었습니다.');
      } else {
        message.error('수량 변경 실패');
      }
    } catch (error) {
      console.error("👉 서버 통신 에러:", error);
      message.error('수량 변경 중 오류 발생');
    }
  };

  // 아이템 삭제
  const handleRemove = (seller, itemNo) => {
    setGroupedCartItems(prev => {
      const updatedSellerItems = prev[seller].filter(item => item.itemNo !== itemNo);
      const updated = { ...prev, [seller]: updatedSellerItems };
      // 판매자 그룹이 빈 경우 삭제
      if (updated[seller].length === 0) {
        delete updated[seller];
      }
      return updated;
    });
  }


  // const handleCheckout = () => {
  //   // 전체 담긴 아이템 평탄화해서 넘김
  //   const flatCartItems = Object.entries(groupedCartItems).flatMap(([seller, items]) => items);
  //   navigate('/checkout', { state: { cartItems: flatCartItems, totalPrice } });
  // }

  const handleCheckout = () => {
    const flatSelectedItems = Object.values(selectedItems).flatMap(sellerItems => Object.values(sellerItems));
    navigate('/checkout', { state: { cartItems: flatSelectedItems, totalPrice: selectedTotalPrice } });
  }
  

  return (
    <Content style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <div className="cart-page">
        <div style={{ maxWidth: '1100px', width: '100%' }}>
          <Title level={2}>🛒 장바구니</Title>
          <Divider />

          {Object.keys(groupedCartItems).length === 0 ? (
            <Text className="cart-empty">장바구니가 비어 있습니다.</Text>
          ) : (
            <>
              {Object.entries(groupedCartItems).map(([seller, items]) => (
                <div key={seller} style={{ marginBottom: '40px' }}>
                  <Title level={4}>판매자 : {seller}</Title>
                  <Row gutter={[16, 16]} justify="center">
                    {items.map(item => (
                      <Col xs={24} sm={12} md={8} lg={6} xl={6} style={{ minWidth: '280px', maxWidth: '350px' }} key={item.itemNo}>
                        <Card
                          hoverable
                          cover={
                            <>
                              <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
                                <Checkbox
                                  checked={selectedItems[seller]?.[item.itemNo] !== undefined}
                                  onChange={(e) => handleSelectItem(seller, item.itemNo, e.target.checked, item)}
                                />
                              </div>
                              <img
                                alt={item.title}
                                src={item.imgDefault ? item.imgDefault : '/default-image.png'}
                                onError={(e) => e.target.src='/default-image.png'}
                              />
                            </>
                          }
                        >
                          <Card.Meta
                            title={<Text strong>{item.title}</Text>}
                            description={<Text>{item.bookprice.toLocaleString()}원</Text>}
                          />
                          <div style={{ marginTop: '8px' }}>
                            <Text type="secondary">
                              소계: {(item.bookprice * item.quantity).toLocaleString()}원
                            </Text>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                            <InputNumber
                              min={1}
                              max={99}
                              value={item.quantity}
                              onChange={value => handleQuantityChange(seller, item.itemNo, value || 1, item.cartNo)}
                            />
                            <Button danger icon={<DeleteOutlined />} onClick={() => handleRemove(seller, item.itemNo)}>
                              삭제
                            </Button>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}

              <Divider />

              <div className="cart-total-box">
                <Title level={4}>총 결제 금액: {selectedTotalPrice.toLocaleString()}원</Title>
                <Button type="primary" size="large" onClick={handleCheckout} disabled={selectedTotalPrice === 0}>
                  구매하기
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Content>
  );
}
