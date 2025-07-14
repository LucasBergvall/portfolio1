import React from 'react';
import { Layout, Menu, Button, Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined, FileTextOutlined, FileSearchOutlined, CloudUploadOutlined, CloudServerOutlined} from '@ant-design/icons';

const { Content, Sider } = Layout;

export default function MyPage() {
  return (
    <Layout>
      <Layout>
        {/* 사이드바 */}
        <Sider width={250} style={{ background: '#f0f2f5', height: '100vh', paddingTop: '20px' }}>
          <Menu
            mode="inline"
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1" icon={<UserOutlined />}><Link to="/profile">회원정보 관리</Link></Menu.Item>
            <Menu.Item key="2" icon={<FileTextOutlined />}><Link to="/salehistory">판매내역</Link></Menu.Item>
            <Menu.Item key="3" icon={<ShoppingCartOutlined />}><Link to="/item-register">등록한 상품</Link></Menu.Item>
            <Menu.Item key="4" icon={<CloudUploadOutlined />}><Link to="/item-register-form/tool">공구 등록</Link></Menu.Item>
            <Menu.Item key="5" icon={<CloudServerOutlined />}><Link to="/item-register-form/inverter">인버터 등록</Link></Menu.Item>
            <Menu.Item key="6" icon={<FileSearchOutlined />}><Link to="/address">배송주소 관리</Link></Menu.Item>
            <Menu.Item key="7" icon={<FileSearchOutlined />}><Link to="/ratingpage">나의 평점</Link></Menu.Item>
          </Menu>
        </Sider>

        {/* 본문 */}
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <h2>마이페이지</h2>
            <Card>
              <p>환영합니다, [사용자 이름]님!</p>
              <p>여기에서 회원 정보 및 기타 설정을 관리할 수 있습니다.</p>
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
