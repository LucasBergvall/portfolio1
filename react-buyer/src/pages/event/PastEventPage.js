// src/pages/PastEventPage.jsx
import React, { useState, useRef } from "react";
import { Layout, Row, Col, Card, } from "antd";
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import "./css/PastEventPage.css";
import book1 from "../../assets/book1.jpg";
import book2 from "../../assets/book2.jpg";
import book3 from "../../assets/book3.jpg";

const { Content } = Layout;
const { Meta } = Card;

const pastEvents = [
  { id: 1, name: "2023 베스트셀러 할인전", price: 18000, image: book1 },
  { id: 2, name: "2024 신학기 1+1 이벤트", price: 25000, image: book2 },
  { id: 3, name: "2023 독서의 달 기념전", price: 32000, image: book3 },
];

const items = [
  {
    key: "1",
    label: "마이 페이지",
    icon: <UserOutlined />,
    onClick: () => (window.location.href = "/mypage"),
  },
  { type: "divider" },
  {
    key: "2",
    label: "로그인",
    icon: <LoginOutlined />,
    onClick: () => (window.location.href = "/login"),
  },
  {
    key: "3",
    label: "로그아웃",
    icon: <LogoutOutlined />,
    onClick: () => (window.location.href = "/logout"),
  },
  {
    key: "4",
    label: "회원가입",
    icon: <IdcardOutlined />,
    onClick: () => (window.location.href = "/join"),
  },
];

const PastEventPage = () => {
  
  return (
    <Layout>
      <Content style={{ padding: "40px 60px", maxWidth: "1200px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>📅 지난 이벤트 - 이벤트 종료 </h2>
        <Row gutter={[16, 24]} justify="start">
          {pastEvents.map((event) => (
            <Col
              key={event.id}
              xs={24}
              sm={12}
              md={12}
              lg={8}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                hoverable
                className="expired-card"
                style={{
                  width: "280px",
                  borderRadius: "8px",
                  pointerEvents: "none", // 클릭 불가능
                }}
                bodyStyle={{ padding: 0 }}
              >
                <div className="expired-image-wrapper">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="expired-image"
                  />
                </div>
                <div className="card-body-content">
                  <Meta
                    title={event.name}
                    description={
                      <>
                        <div
                          style={{ fontWeight: "bold", marginBottom: "4px" }}
                        >
                          {event.price.toLocaleString()}원
                        </div>
                        <div className="oneplus-badge">이벤트 종료</div>
                      </>
                    }
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default PastEventPage;
