// src/pages/ItemRegisterForm.js
import React from 'react';
import { Form, Input, InputNumber, Button, Upload, message, Card, Layout, Menu } from 'antd';
import { UploadOutlined, UserOutlined, FileTextOutlined, ShoppingCartOutlined, CloudUploadOutlined, FileSearchOutlined, CloudServerOutlined } from '@ant-design/icons';
import './InverterRegisterForm.css';
import { useNavigate, Link } from 'react-router-dom';

export default function InverterRegisterForm({ setItemList }) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { Sider } = Layout;

  const onFinish = (values) => {
    const fileList = values.images || [];
    const thumbnail = fileList[0]?.thumbUrl || '';

    const newItem = {
      id: Date.now(),
      title: values.tool_name,
      model: values.model_name,
      min_vac: values.min_vac,
      max_vac: values.max_vac,
      motor_power: values.motor_power,
      output_current: values.output_current,
      year: values.year,
      price: values.price,
      description: values.description,
      thumbnail,
      date: new Date().toISOString().slice(0, 10),
    };

    setItemList(prev => [...prev, newItem]);
    message.success('상품이 성공적으로 등록되었습니다!');
    form.resetFields();
    navigate('/item-register');
  };

  const onFinishFailed = (errorInfo) => {
    console.log('등록 실패:', errorInfo);
    message.error('상품 등록에 실패했습니다. 다시 시도해 주세요.');
  };

  return (
    <Layout className="inverter-register-form-container">
      {/* 사이드바 */}
        <Sider width={250} style={{ background: '#f0f2f5', height: '100vh', paddingTop: '20px' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['5']}
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
      <div className="inverter-register-form">
        <h2>인버터 등록</h2>
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item label="상품명" name="inverter_name" rules={[{ required: true, message: '상품명을 입력해 주세요.' }]}>
              <Input placeholder="상품명을 입력하세요" />
            </Form.Item>

            <Form.Item label="모델명" name="model_name" rules={[{ required: true, message: '모델명을 입력해 주세요.' }]}>
              <Input placeholder="모델명을 입력하세요" />
            </Form.Item>

            <Form.Item label="최소 출력전압" name="min_vac" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} placeholder="최소 출력전압" />
            </Form.Item>

            <Form.Item label="최대 출력전압" name="max_vac" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} placeholder="최대 출력전압" />
            </Form.Item>

            <Form.Item label="마력" name="motor_power" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} placeholder="마력" />
            </Form.Item>

            <Form.Item label="출력 전류" name="output_current" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} placeholder="출력 전류" />
            </Form.Item>

            <Form.Item label="연식" name="year" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} placeholder="연식" />
            </Form.Item>

            <Form.Item label="가격" name="price" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} min={0} placeholder="가격" />
            </Form.Item>

            <Form.Item label="상품 설명" name="description" rules={[{ required: true }]}>
              <Input.TextArea rows={4} placeholder="상품 설명을 입력하세요" />
            </Form.Item>

            <Form.Item
              label="상품 이미지 업로드"
              name="images"
              valuePropName="fileList"
              getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
            >
              <Upload name="images" listType="picture" multiple beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>이미지 선택</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button className='inverter-register-btn' type="primary" htmlType="submit" block style={{background: '#F7C600', color: '#000000'}}>
                상품 등록
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Layout>
  );
}
