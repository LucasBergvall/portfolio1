// src/pages/ItemRegisterForm.js
import React from 'react';
import {
  Form, Input, InputNumber, Button, Upload, message,
  Card, Layout, Menu, Select                 /* ✅ */
} from 'antd';
import {
  UploadOutlined, UserOutlined, FileTextOutlined,
  ShoppingCartOutlined, CloudUploadOutlined,
  FileSearchOutlined, CloudServerOutlined
} from '@ant-design/icons';
import './ToolRegisterForm.css';
import { useNavigate, Link } from 'react-router-dom';

export default function InverterRegisterForm({ setItemList }) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { Sider } = Layout;
  const { Option } = Select;                /* ✅ */

  /** 카테고리 옵션 목록 ✅ */
  const categoryOptions = [
    { value: 'hammer',       label: '해머' },
    { value: 'wrench',       label: '렌치' },
    { value: 'driver',       label: '드라이버' },
    { value: 'plier',        label: '플라이어' },
    { value: 'gas_can',      label: '가솔린 캔' },
    { value: 'carpet',       label: '카펫' },
    { value: 'rope',         label: '로프' },
    { value: 'tool_box',     label: '공구박스' },
  ];

  const onFinish = (values) => {
    const fileList  = values.images || [];
    const thumbnail = fileList[0]?.thumbUrl || '';

    const newItem = {
      id: Date.now(),
      /** ✅ 선택된 카테고리 포함 */
      category: values.category,
      title: values.tool_name,
      model: values.model_name,
      min_vac: values.min_vac,
      max_vac: values.max_vac,
      motor_power: values.motor_power,
      output_current: values.output_current,
      year: values.year,
      price: values.price,           // 달러 단위
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
    <Layout className="tool-register-form-container">
      {/* ---------- 사이드바 ---------- */}
      <Sider
        width={250}
        style={{ background: '#f0f2f5', height: '100vh', paddingTop: 20 }}
      >
        <Menu mode="inline" defaultSelectedKeys={['4']} style={{ height: '100%', borderRight: 0 }}>
          <Menu.Item key="1" icon={<UserOutlined />}><Link to="/profile">회원정보 관리</Link></Menu.Item>
          <Menu.Item key="2" icon={<FileTextOutlined />}><Link to="/salehistory">판매내역</Link></Menu.Item>
          <Menu.Item key="3" icon={<ShoppingCartOutlined />}><Link to="/item-register">등록한 상품</Link></Menu.Item>
          <Menu.Item key="4" icon={<CloudUploadOutlined />}><Link to="/item-register-form/tool">공구 등록</Link></Menu.Item>
          <Menu.Item key="5" icon={<CloudServerOutlined />}><Link to="/item-register-form/inverter">인버터 등록</Link></Menu.Item>
          <Menu.Item key="6" icon={<FileSearchOutlined />}><Link to="/address">배송주소 관리</Link></Menu.Item>
          <Menu.Item key="7" icon={<FileSearchOutlined />}><Link to="/ratingpage">나의 평점</Link></Menu.Item>
        </Menu>
      </Sider>

      {/* ---------- 본문 ---------- */}
      <div className="tool-register-form">
        <h2>공구 등록</h2>
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            {/* ✅ 카테고리 Select (검색 가능) */}
            <Form.Item
              label="카테고리"
              name="category"
              rules={[{ required: true, message: '카테고리를 선택해 주세요.' }]}
            >
              <Select
                showSearch
                placeholder="해머, 렌치 등 카테고리를 선택하세요"
                optionFilterProp="children"
                options={categoryOptions}
                filterOption={(input, option) =>
                  option?.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item
              label="상품명"
              name="tool_name"
              rules={[{ required: true, message: '상품명을 입력해 주세요.' }]}
            >
              <Input placeholder="상품명을 입력하세요" />
            </Form.Item>

            {/* 생략-가능: 나머지 스펙 입력란들 … */}

            {/* ✅ 달러 단위 가격 입력 */}
            <Form.Item
              label="가격 (USD)"
              name="price"
              rules={[{ required: true, message: '가격을 입력해 주세요.' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                placeholder="가격"
                formatter={value =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={value => value.replace(/\$\s?|,/g, '')}
              />
            </Form.Item>

            {/* ✅ 무게 입력 (kg) */}
            <Form.Item
              label="무게 (kg)"
              name="weight"
              rules={[{ required: true, message: '무게를 입력해 주세요.' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                placeholder="예: 2.5"
              />
            </Form.Item>

            {/* ✅ 재질 선택 */}
            <Form.Item
              label="재질"
              name="material"
              rules={[{ required: true, message: '재질을 선택해 주세요.' }]}
            >
              <Select placeholder="재질을 선택하세요">
                <Select.Option value="steel">강철</Select.Option>
                <Select.Option value="plastic">플라스틱</Select.Option>
                <Select.Option value="wood">목재</Select.Option>
                <Select.Option value="aluminum">알루미늄</Select.Option>
                <Select.Option value="rubber">고무</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="상품 설명"
              name="description"
              rules={[{ required: true, message: '상품 설명을 입력해 주세요.' }]}
            >
              <Input.TextArea rows={4} placeholder="상품 설명을 입력하세요" />
            </Form.Item>

            <Form.Item
              label="상품 이미지 업로드"
              name="images"
              valuePropName="fileList"
              getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
            >
              <Upload name="images" listType="picture" multiple beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>이미지 선택</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                className="tool-register-btn"
                type="primary"
                htmlType="submit"
                block
                style={{ background: '#F7C600', color: '#000000' }}
              >
                상품 등록
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Layout>
  );
}
