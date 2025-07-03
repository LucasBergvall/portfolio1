import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { FileSearchOutlined, UserOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

const { Sider, Content } = Layout;


const MyPage = () => {

// 1. 변수
  const { mypage_menu } = useSelector((state) => state.MenuReducer); 
  const dispatch = useDispatch();


  // 3. 함수
  const handleMenuClick = ({ key }) => {
    dispatch({type: 'mypage_menu', idx : key}); // Redux 상태도 업데이트하고 싶을 경우
  };


  // 4. html렌더링
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 사이드바 */}
      <Sider width={250} style={{ background: '#f0f2f5', paddingTop: '20px' }}>
        <Menu
          mode="inline"
          selectedKeys={[mypage_menu]}
          onClick={handleMenuClick}  // 클릭 이벤트는 그대로 유지
          style={{ height: '100%', borderRight: 0 }}
          items={[
            {
              key: "1",
              icon: <UserOutlined />,
              label: <Link to="/mypage/profile">회원정보 관리</Link>
            },
            {
              key: "2",
              icon: <FileSearchOutlined />,
              label: <Link to="/mypage/address">배송주소 관리</Link>
            },
            {
              key: "3",
              icon: <UserOutlined />,
              label: <Link to="/mypage/changepw">비밀번호 변경</Link>
            },
            {
              key: "4",
              icon: <UserOutlined />,
              label: <Link to="/mypage/userout">회원 탈퇴</Link>
            },
            {
              key: "5",
              icon: <UserOutlined />,
              label: <Link to="/mypage/buyhistory">주문 목록</Link>
            },
            {
              key: "6",
              icon: <UserOutlined />,
              label: <Link to="/mypage/review-list">내가 쓴 리뷰 목록</Link>
            },
          ]}
        />
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

export default MyPage;