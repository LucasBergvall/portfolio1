import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import {
  UserOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

const { Sider, Content } = Layout;


const GuestPage1 = () => {
  // 1. 변수
  const { sale_menu } = useSelector((state) => state.MenuReducer); 
  console.log(sale_menu);
  const dispatch = useDispatch();


  // 3. 함수
  const handleMenuClick = ({ key }) => {
    dispatch({type: 'sale_menu', idx : key}); // Redux 상태도 업데이트하고 싶을 경우
  };


  // 4. html렌더링
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 사이드바 */}
      <Sider width={250} style={{ background: '#f0f2f5', paddingTop: '20px' }}>
        <Menu
          mode="inline"
          selectedKeys={[sale_menu]}
          onClick={handleMenuClick}        // 클릭 이벤트
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<UserOutlined />}>
            <Link to="/guest/profile">고객관리</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* 본문 영역 */}
      <Layout style={{ padding: '24px', background: '#fff', flex: 1 }}>
        <Content style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default GuestPage1;