import React from 'react';
import { Layout, Menu, Button, Card, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined, FileTextOutlined, FileSearchOutlined, CloudUploadOutlined, CloudServerOutlined} from '@ant-design/icons';
const { Content, Sider } = Layout;


export default function MyPage2() {
  return (
    <Layout>
      <Layout>
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
