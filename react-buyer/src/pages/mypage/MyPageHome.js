import React, { useState, useEffect, useRef } from "react";
import { Layout, Card, } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import "./css/MyPageHome.css";
import { useDispatch } from "react-redux";

const { Header, Content, Sider, Footer } = Layout;

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

export default function MyPageHome() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const isSeller = location.pathname.includes("/seller");
  const [switchOn, setSwitchOn] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const toggleWrapperRef = useRef(null);
  const [darkMode] = useState(false);

    const dispatch = useDispatch();

  // 2. 이펙트
    useEffect(() => {
      // 페이지에 처음 진입할 때 한 번 dispatch 실행
      dispatch({ type: 'mypage_menu', idx: "0" });
    }, [dispatch]);

  const updatedItems = isLoggedIn
    ? items.filter((item) => item.key !== "2")
    : items.filter((item) => item.key !== "3");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        toggleWrapperRef.current &&
        !toggleWrapperRef.current.contains(event.target)
      ) {
        setShowMegaMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Layout className={darkMode ? "dark-mode" : ""}>
      <Layout style={{ flex: 1 }}>
        <Layout style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Content className="mypage-content" style={{ flex: 1 }}>
            <h2>{isSeller ? "마이페이지 (판매자)" : "마이페이지 (구매자)"}</h2>
            <Card>
              <p>환영합니다, {isSeller ? "판매자" : "구매자"}님!</p>
              <p>
                {isSeller
                  ? "판매내역과 등록 상품을 관리하세요."
                  : "구매내역과 찜한 상품을 확인하세요."}
              </p>
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
