import React from 'react';
import { Layout, Menu, } from 'antd';
import { Link } from 'react-router-dom';

import {
  ShoppingCartOutlined, HeartOutlined, UserOutlined, FileTextOutlined,
  FileSearchOutlined, StarOutlined,CloudUploadOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

export default function SideabarLayout() {
  return (
    <Layout className="Sidebar-layout">
    {/* 사이드바 */}
      <Sider width={250} style={{ background: '#f0f2f5', height: '100vh', paddingTop: '20px' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['4']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<UserOutlined />}><Link to="/profile">회원정보 관리</Link></Menu.Item>
          <Menu.Item key="2" icon={<FileTextOutlined />}><Link to="/salehistory">판매내역</Link></Menu.Item>
          <Menu.Item key="3" icon={<ShoppingCartOutlined />}><Link to="/item-register">등록한 상품</Link></Menu.Item>
          <Menu.Item key="4" icon={<CloudUploadOutlined />}><Link to="/item-register-form">상품 등록</Link></Menu.Item>
          <Menu.Item key="5" icon={<FileSearchOutlined />}><Link to="/address">배송주소 관리</Link></Menu.Item>
          <Menu.Item key="6" icon={<FileSearchOutlined />}><Link to="/ratingpage">나의 평점</Link></Menu.Item>
        </Menu>
      </Sider>
    </Layout>
  );
}