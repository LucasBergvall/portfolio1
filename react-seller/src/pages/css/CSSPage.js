import React, { useState } from 'react';
import { Layout, Menu, Card, } from 'antd';
import {
  MessageOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // ✅ 추가
import './css/CSSPage.css';

const { Sider, Content } = Layout;

export default function CssPage() {
  const navigate = useNavigate(); // ✅ 추가
  const [darkMode] = useState(false);

  return (
    <Layout className={darkMode ? 'dark-mode' : ''}>
      <Layout style={{ flex: 1 }}>
        <Sider width={250} className="css-sider">
          <Menu
            mode="inline"
            defaultSelectedKeys={['0']}
            style={{ height: '100%' }}
            items={[
              {
                key: '1',
                icon: <MessageOutlined />,
                label: <span onClick={() => navigate('/inquiry-page')}>문의가 들어온 상품</span> // ✅ 수정됨
              },
            ]}
          />
        </Sider>

          <Layout style={{ padding: '0 24px 24px' }}>
          <Content className="css-content">
            <h2>고객센터</h2>
            <Card>
              <p>무엇을 도와드릴까요? 궁금한 점이 있다면 1대1 문의를 통해 상담을 시작해보세요.</p>
            </Card>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}