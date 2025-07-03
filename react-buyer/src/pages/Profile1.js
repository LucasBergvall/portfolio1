import React, { useState, useRef } from "react";
import {
  Card,
  Form,
  Button,
  Layout,
  Menu,
  Space,
  Dropdown,
  Switch,
  message,
  Input,
} from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Profile1.css";

import {
  ShoppingCartOutlined,
  HeartOutlined,
  UserOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  BookOutlined,
  CloudOutlined,
  StarOutlined,
  DownOutlined,
  UpOutlined,
  LoginOutlined,
  LogoutOutlined,
  IdcardOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Header, Sider } = Layout;

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

export default function Profile() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const isSeller = location.pathname.includes("/seller");
  const [switchOn, setSwitchOn] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const toggleWrapperRef = useRef(null);
  const [darkMode] = useState(false);

  const updatedItems = isLoggedIn
    ? items.filter((item) => item.key !== "2")
    : items.filter((item) => item.key !== "3");

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = (values) => {
    setLoading(true);

    const updatedFields = {};
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        updatedFields[key] = values[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      message.warning("변경할 내용을 입력해주세요.");
      setLoading(false);
      return;
    }

    console.log("변경된 정보:", updatedFields);

    setTimeout(() => {
      message.success("회원정보가 성공적으로 수정되었습니다.");
      form.resetFields();
      setLoading(false);
    }, 1000);
  };

  // 카카오 주소 검색 (Input 클릭 시 실행)
  const handleAddressClick = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddress = data.address;
        form.setFieldsValue({ address: fullAddress });
      },
    }).open();
  };

  return (
    <Layout className={darkMode ? "dark-mode" : ""}>
      <Layout style={{ flex: 1 }}>
        <Sider width={250} className="profile-sider">
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{ height: "100%" }}
            items={[
              {
                key: "1",
                icon: <UserOutlined />,
                label: <Link to="/profile">회원정보 관리</Link>
              },
              {
                key: "2",
                icon: <FileTextOutlined />,
                label: <Link to="/purchase-history">구매내역</Link>
              },
              {
                key: "3",
                icon: <HeartOutlined />,
                label: <Link to="/like">찜한상품</Link>
              },
              {
                key: "4",
                icon: <ShoppingCartOutlined />,
                label: <Link to="/cart">장바구니</Link>
              },
              {
                key: "5",
                icon: <FileSearchOutlined />,
                label: <Link to="/address">배송주소 관리</Link>
              },
            ]}
          />
        </Sider>

        <div className="profile-container">
          <Card title="회원정보 관리" className="profile-card">
            <Form form={form} layout="vertical" onFinish={handleFinish}>
              <Form.Item
                label="닉네임"
                name="nickname"
                style={{ width: "100%" }}
              >
                <Input placeholder="새 닉네임 입력" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="비밀번호"
                name="password"
                style={{ width: "100%" }}
              >
                <Input.Password
                  placeholder="새 비밀번호 입력"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item label="주소" name="address" style={{ width: "100%" }}>
                <Input
                  placeholder="주소를 클릭해서 검색하세요."
                  style={{ width: "100%" }}
                  readOnly
                  onClick={handleAddressClick}
                />
              </Form.Item>

              <Form.Item
                name="detailAddress"
                rules={[
                  { required: true, message: "상세 주소를 입력해주세요!" },
                ]}
                style={{ width: "100%" }}
              >
                <Input placeholder="상세 주소 입력" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="전화번호"
                name="phone"
                style={{ width: "100%" }}
              >
                <Input
                  placeholder="새 전화번호 입력"
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  수정하기
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Layout>
    </Layout>
  );
}
