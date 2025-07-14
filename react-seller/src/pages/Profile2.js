import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined, FileTextOutlined, FileSearchOutlined, CloudUploadOutlined, CloudServerOutlined, } from '@ant-design/icons';
import './Profile2.css';

export default function Profile() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { Sider } = Layout;

  const handleFinish = (values) => {
    setLoading(true);

    const updatedFields = {};
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        updatedFields[key] = values[key];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      message.warning('변경할 내용을 입력해주세요.');
      setLoading(false);
      return;
    }

    console.log('변경된 정보:', updatedFields);

    setTimeout(() => {
      message.success('회원정보가 성공적으로 수정되었습니다.');
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
      }
    }).open();
  };

  return (
    <Layout className='profile-layout'>
      {/* 사이드바 */}
      <Sider width={250} style={{ background: '#f0f2f5', height: '100vh', paddingTop: '20px' }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
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
      <div className="profile-container">
        <Card title="회원정보 관리" className="profile-card">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
          >
            <Form.Item label="닉네임" name="nickname">
              <Input placeholder="새 닉네임 입력" />
            </Form.Item>

            <Form.Item label="비밀번호" name="password">
              <Input.Password placeholder="새 비밀번호 입력" />
            </Form.Item>

            <Form.Item label="주소" name="address">
              <Input
                placeholder="주소를 클릭해서 검색하세요."
                readOnly
                onClick={handleAddressClick}
              />
            </Form.Item>

            <Form.Item
              name="detailAddress"
              rules={[{ required: true, message: '상세 주소를 입력해주세요!' }]}>
                        <Input placeholder="상세 주소 입력" />
              </Form.Item>

            <Form.Item label="전화번호" name="phone">
              <Input placeholder="새 전화번호 입력" />
            </Form.Item>

            <Form.Item>
              <Button className="profile-btn" type="primary" htmlType="submit" loading={loading} style={{background: '#F7C600', color: '#000000'}}>
                수정하기
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Layout>
  );
}
