// src/pages/ItemRegisterPage.js
import React from 'react';
import { Card, List, Button, Menu, Layout } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, FileTextOutlined, ShoppingCartOutlined, CloudUploadOutlined, FileSearchOutlined, CloudServerOutlined } from '@ant-design/icons';
import './ItemRegisterPage.css';

export default function ItemRegisterPage({ itemList }) {
  const { Sider } = Layout;
  const navigate = useNavigate();

  return (
    <Layout className="item-register-container">
      {/* 사이드바 */}
        <Sider width={250} style={{ background: '#f0f2f5', height: '100vh', paddingTop: '20px' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['3']}
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
      <div className="item-register-page">
        <h2>등록한 상품</h2>
        <Card>
          <List
            itemLayout="horizontal"
            dataSource={itemList}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button type="link" key="edit">수정</Button>,
                  <Button type="link" danger key="delete">삭제</Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    item.thumbnail && (
                      <img
                        src={item.thumbnail}
                        alt="썸네일"
                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                      />
                    )
                  }
                  title={item.title}
                  description={`등록일: ${item.date} | 가격: ${item.price.toLocaleString()}원`}
                />
              </List.Item>
            )}
          />
        </Card>

        <div className="item-register-add">
          <Link to="/item-register-button  ">
            <Button
              block
              className="item-register-btn"
              style={{ marginTop: 16 }}
              onClick={() => navigate('/item-register-button')}
            >
              새 상품 등록하기
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
