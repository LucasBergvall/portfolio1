import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Typography, Divider, Layout, message, Spin } from "antd";
import { DeleteOutlined, ShoppingCartOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import "./css/LikePage.css";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function LikePage() {
  // 1. 변수
  const [loading, setLoading] = useState(true);
  const [likeItems, setLikeItems] = useState([]);
  const [page] = useState(1);
  const { token } = useSelector(state => state.LoginReducer);
  const navigate = useNavigate();
  
  const cnt = 1000;

  // 2. 이펙트
  useEffect(() => {
    if (token) fetchLikeItems();
  }, [token]);

  // 3. 함수
  const fetchLikeItems = async () => {
    try {
      setLoading(true);
      const url = `/api2/like/selectlist?page=${page}&cnt=${cnt}`;
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(url, { headers });
      
      if (res.data.status === 1) {
        console.log(res.data);
        const list = res.data.list.map(like => ({
          key: like.likeNo,
          itemNo: like.itemNo,
          name: like.title,
          price: like.bookprice ?? 0,
          image: like.imageNo 
            ? `/api2/itemimage/image?no=${like.imageNo}` 
            : '/default-image.png'
        }));
        setLikeItems(list);
      }
    } catch (err) {
      console.error(err);
      message.error("찜 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLike = async (itemNo) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = { item: { no: itemNo } };
      const res = await axios.delete('/api2/like/delete', { headers, data: body });
      if (res.data.status === 1) {
        message.success("찜 취소 완료");
        setLikeItems(prev => prev.filter(item => item.itemNo !== itemNo));
      }
    } catch (err) {
      console.error(err);
      message.error("삭제 실패");
    }
  };

  const handleAddToCart = async(itemNo) => {
    if(!token) {
      message.info("로그인이 필요합니다.");
      navigate('/login')
      return;
    }
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const url = `/api2/cart/insert`
      const body = { item : {no : itemNo }};
      const { data } = await axios.post( url, body, { headers } );
      console.log(data);
      if(data.status === 1) {
        message.success('장바구니 담기 완료');    
      } else {
        message.error('장바구니에 담기지 않았습니다.');
        }
    } catch (error) {
      console.log(error);
      message.error('에러 발생', + error.message);
    }
  }

  return (
    <Content className="like-page">
      <Title level={2}>💖 찜한 상품</Title>
      <Divider />
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <Spin size="large" tip="로딩중입니다..." />
        </div>
      ) : (
        <>
          {likeItems.length === 0 ? (
            <Text>찜한 상품이 없습니다.</Text>
          ) : (
            <Row gutter={[16, 16]}>
              {likeItems.map(item => (
                <Col key={item.key} style={{ width: 280, marginBottom: 24 }}>
                  <Card
                    hoverable
                    cover={<img alt={item.name} src={item.image} />}
                    actions={[
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveLike(item.itemNo)}
                      >
                        찜 취소
                      </Button>,
                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined />}
                        onClick={() => handleAddToCart(item.itemNo)}
                      >
                        장바구니
                      </Button>
                    ]}
                  >
                    <Card.Meta title={item.name} description={`${item.price.toLocaleString()}원`} />
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
       {/* ✅ 장바구니 이동 버튼 */}
      <div style={{ position: "fixed", bottom: "40px", right: "40px" }}>
        <Button 
          type="primary" 
          size="large" 
          icon={<ShoppingOutlined />}
          onClick={() => navigate("/item/cart")} 
        >
          장바구니 가기
        </Button>
      </div>
    </Content>
  );
}
