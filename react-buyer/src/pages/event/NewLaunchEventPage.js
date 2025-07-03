import React, { useState, useRef } from "react";
import { Layout, Row, Col, Card, Button, Dropdown, Space, Switch } from "antd";
import {
  HeartOutlined,
  ShoppingCartOutlined,
  BookOutlined,
  DownOutlined,
  UpOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  IdcardOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./css/NewLaunchEventPage.css";
import book4 from "../../assets/book4.jpg";
import book6 from "../../assets/book6.jpg";
import book9 from "../../assets/book9.jpg";
import book7 from "../../assets/book7.jpg";
import book1 from "../../assets/book1.jpg";
import book2 from "../../assets/book2.jpg";
import book3 from "../../assets/book3.jpg";
import book5 from "../../assets/book5.jpg";

const { Header, Content } = Layout;
const { Meta } = Card;

const newBooks = [
  {
    id: 1,
    name: "소년이 온다",
    price: 22000,
    benefit: "북마크 세트 증정",
    image: book4,
    deadline: "2025-06-12",
  },
  {
    id: 2,
    name: "내가 원하는 것을 나도 모를 때",
    price: 27000,
    benefit: "한정판 굿즈 포함",
    image: book6,
    deadline: "2025-06-01",
  },
  {
    id: 3,
    name: "디스이즈 도쿄",
    price: 25000,
    benefit: "배송비 무료 + 사인본 이벤트",
    image: book9,
    deadline: "2025-05-31",
  },
  {
    id: 4,
    name: "해커스 AFPK 핵심문제집",
    price: 30000,
    benefit: "한정 스티커 세트",
    image: book1,
    deadline: "2025-05-22",
  },
  {
    id: 5,
    name: "작별하지 않는다",
    price: 24000,
    benefit: "한정 스티커 세트",
    image: book2,
    deadline: "2024-12-31",
  },
  {
    id: 6,
    name: "듀얼 브레인",
    price: 24000,
    benefit: "한정 스티커 세트",
    image: book5,
    deadline: "2024-10-21",
  },
  {
    id: 7,
    name: "포기할 자유",
    price: 24000,
    benefit: "한정판 굿즈 포함",
    image: book3,
    deadline: "2024-11-30",
  },
  {
    id: 8,
    name: "세이노의 가르침",
    price: 24000,
    benefit: "한정 스티커 세트",
    image: book7,
    deadline: "2024-09-27",
  },
];

const menuItems = [
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

const NewLaunchEventPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const toggleWrapperRef = useRef(null);

  const updatedItems = isLoggedIn
    ? menuItems.filter((item) => item.key !== "2")
    : menuItems.filter((item) => item.key !== "3");

  const calculateDDay = (deadline) => {
    const today = new Date();
    const endDate = new Date(deadline);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `(D-${diffDays})`;
    else if (diffDays === 0) return `(D-DAY)`;
    else return `(마감됨)`;
  };

  const getDeadlineText = (book) => {
    return `${book.benefit} ${calculateDDay(book.deadline)}`;
  };

  const isExpired = (deadline) => {
    const today = new Date();
    const endDate = new Date(deadline);
    return endDate < today;
  };

  return (
    <Layout>
      <Content
        style={{ padding: "40px 60px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          🚀 신간 런칭 이벤트 - 사전 예약 시 선물 제공!
        </h2>
        <h3
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: "#ff4d4f",
          }}
        >
          📅 사전 예약 기간: 2025년 5월 20일 ~ 2025년 6월 12일
        </h3>
        <Row gutter={[16, 24]} justify="start">
          {[...newBooks]
            .sort((a, b) => {
              const expiredA = isExpired(a.deadline);
              const expiredB = isExpired(b.deadline);
              return expiredA - expiredB; // false(0)는 앞으로, true(1)는 뒤로
            })
            .map((book) => (
              <Col
                key={book.id}
                xs={24}
                sm={12}
                md={12}
                lg={8}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  hoverable
                  className={isExpired(book.deadline) ? "card-disabled" : ""}
                  style={{ width: "280px", borderRadius: "8px", padding: 0 }}
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="newlaunch-image-wrapper">
                    <img
                      src={book.image}
                      alt={book.name}
                      className="newlaunch-image"
                    />
                  </div>
                  <div className="card-body-content">
                    <Meta
                      title={book.name}
                      description={
                        <>
                          <div
                            style={{ fontWeight: "bold", marginBottom: "4px" }}
                          >
                            {book.price.toLocaleString()}원
                          </div>
                          <div className="benefit-badge">🎁 {book.benefit}</div>
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#888",
                              marginTop: "4px",
                            }}
                          >
                            ⏰ 사전 예약 마감일: {book.deadline}{" "}
                            {calculateDDay(book.deadline)}
                          </div>
                        </>
                      }
                    />

                    <div className="product-buttons">
                      <Button type="primary" icon={<HeartOutlined />}>
                        찜 하기
                      </Button>
                      <Button type="primary" icon={<ShoppingCartOutlined />}>
                        장바구니
                      </Button>
                    </div>

                    <div style={{ textAlign: "center", marginTop: "12px" }}>
                      <Button
                        type="default"
                        disabled={isExpired(book.deadline)}
                        onClick={() => navigate(`/preorder/${book.id}`)}
                      >
                        {isExpired(book.deadline) ? "마감됨" : "사전 예약하기"}
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
        </Row>
      </Content>
    </Layout>
  );
};

export default NewLaunchEventPage;
