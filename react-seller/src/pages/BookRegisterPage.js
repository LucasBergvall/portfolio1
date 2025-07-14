// src/pages/ItemRegisterForm.js
import React, {useState, useEffect} from 'react';
import axios from 'axios';
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
import { useSelector } from 'react-redux';
import SideabarLayout from '../layouts/SidebarLayout';

export default function ToolRegisterForm({ setItemList }) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { Sider } = Layout;
  const { Option } = Select;
  const [itemData, setItemData] = useState({});
  const [bookData, setBookData] = useState({});          

  const { token, logged } = useSelector((state) => state.LoginReducer); 

  /** 카테고리 옵션 목록 ✅ */
  const bookOptions = [
    { value: 1, label: '장르1' },
    { value: 2, label: '장르2' },
    { value: 3, label: '장르3' },
  ]

  const onFinish = async (values) => {
    console.log(values)
    // book_name 이랑 title 같이 들어가게
    try {
      /*
      // ✅ item + tool 등록용 FormData 생성
      const formData = new FormData();
      formData.append('item', new Blob([JSON.stringify(itemData)], { type: 'application/json' }));
      formData.append('tool', new Blob([JSON.stringify(toolData)], { type: 'application/json' }));

      // ✅ Item 등록
      const res = await axios.post('/api2/item/tool/insert', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status !== 1) {
        message.error('등록 실패: ' + res.data.message);
        return;
      }

      const itemNo = res.data.itemNo;

      // ✅ 이미지 업로드 (item_img 테이블에 등록)
      for (const file of values.images || []) {
        const imageForm = new FormData();
        const imgObj = {
          item: { no: itemNo },
          img_trans: '',
        };
        imageForm.append('obj', new Blob([JSON.stringify(imgObj)], { type: 'application/json' }));
        imageForm.append('img', file.originFileObj);

        await axios.post('/api2/itemimage/insert.do', imageForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      message.success('상품이 성공적으로 등록되었습니다!');
      form.resetFields();
      navigate('/item-register');
      */
    } catch (err) {
      console.error(err);
      message.error('서버 오류로 등록 실패');
    }
  };



  const onFinishFailed = (errorInfo) => {
    console.log('등록 실패:', errorInfo);
    message.error('상품 등록에 실패했습니다. 다시 시도해 주세요.');
  };

 useEffect(() => {
  
  }, []);


  return (
    <Layout className="tool-register-form-container">
      {/* ---------- 사이드바 ---------- */}
      <SideabarLayout></SideabarLayout>

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
              label="장르"
              name="genre"
              rules={[{ required: true, message: '장르를 선택해 주세요.' }]}
            >
              <Select
                showSearch
                placeholder="장르를 선택하세요"
                optionFilterProp="children"
                options={bookOptions}
                filterOption={(input, option) =>
                  option?.label.toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item
              label="상품명"
              name="book_name"
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

            <Form.Item
              label="할인율 (%)"
              name="discount"
              rules={[{ required: true, message: '할인율을 입력해 주세요.' }]}
            >
              <InputNumber min={0} max={100} placeholder="예: 10" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="수량 (개)"
              name="stock"
              rules={[{ required: true, message: '수량을 입력해 주세요.' }]}
            >
              <InputNumber min={1} placeholder="예: 10" style={{ width: '100%' }} />
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
              <Upload 
                  name="images" 
                  listType="picture" 
                  multiple
                  beforeUpload={(file) => {
                    const isImage = file.type.startsWith('image/');
                    const isSizeOk = file.size / 1024 / 1024 < 5; // 5MB 이하

                    if (!isImage) message.error('이미지 파일만 업로드 가능합니다.');
                    if (!isSizeOk) message.error('이미지 크기는 5MB 이하만 가능합니다.');
                    return false;
                  }}
                  >
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




 