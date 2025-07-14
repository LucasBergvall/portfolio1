// src/pages/ItemRegisterForm.js
import React, {useEffect} from 'react';
import { Card, Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './ItemRegisterButtonPage.css';
import toolImg from '../assets/tool12.png';        // 공구 이미지
import inverterImg from '../assets/inverter1.png';   // 인버터 이미지

export default function ItemRegisterButtonPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.activeElement?.blur(); // 현재 포커스된 요소 해제
  }, []);

  return (
    <div className="item-form-container">
      <h2>상품 종류 선택</h2>
      <Row gutter={24} justify="center">
        <Col xs={24} sm={12} md={10}>
          <Card 
            hoverable 
            cover={
              <img
                alt="공구"
                src={toolImg}
                className="register-img"
                onClick={() => navigate('/item-register-form/tool')}
              />
            }
          >
            <Card.Meta title="공구 등록" description="다양한 공구를 등록해보세요." />
              <Button
                block
                className="custom-yellow-btn"
                style={{ marginTop: 16 }}
                onClick={() => navigate('/item-register-form/tool')}
              >
                공구 등록
              </Button>
            </Card>
        </Col>

        <Col xs={24} sm={12} md={10}>
          <Card
            hoverable
            cover={
              <img 
                alt="인버터" 
                src={inverterImg} 
                className="register-img"
                onClick={() => navigate('/item-register-form/inverter')}
              />
            }
          >
            <Card.Meta title="인버터 등록" description="다양한 공구를 등록해보세요." />
              <Button
                block
                className="custom-yellow-btn"
                style={{ marginTop: 16 }}
                onClick={() => navigate('/item-register-form/inverter')}
              >
                인버터 등록
              </Button>
            </Card>
        </Col>
      </Row>
    </div>
  );
}
