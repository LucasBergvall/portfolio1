import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import {
  UserOutlined,
  FileTextOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

const { Sider, Content } = Layout;

const ItemPage = () => {

  // 1. 변수
  const { item_menu } = useSelector((state) => state.MenuReducer); 
  console.log(item_menu);
  const dispatch = useDispatch();


  // 3. 함수
  const handleMenuClick = ({ key }) => {
    dispatch({type: 'item_menu', idx : key}); // Redux 상태도 업데이트하고 싶을 경우
  };


  // 4. html렌더링
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 본문 영역 */}
      <Layout style={{ padding: '24px', background: '#fff', flex: 1 }}>
        <Content style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ItemPage;
