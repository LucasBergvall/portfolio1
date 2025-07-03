import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Layout, Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined, UserOutlined, FileTextOutlined, FileSearchOutlined, CloudUploadOutlined, CloudServerOutlined, } from '@ant-design/icons';
import './css/Profile.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

export default function Profile() {
  // 1. 변수
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.LoginReducer);
  const [row, setRow] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 2. 이펙트
  useEffect(() => {
    selectinfo();
  }, []);

  useEffect(() => {
    if (row) {
      form.setFieldsValue({
        nickname: row.nickname,
        phone: row.phone
      })
    }
  }, [row]);

  // 3. 함수
  const selectinfo = async() => {
    const url = `/api2/member/info`
    const headers = { Authorization: `Bearer ${token}` }
    const {data} = await axios.get(url, {headers});
    console.log(data);
    setRow(data);
  }

  const handleFinish = async(values) => {

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
    const url = `/api2/member/update`
    const headers = { Authorization: `Bearer ${token}` }
    const body = {"nickname": values.nickname, "phone": values.phone};
    const {data} = await axios.put(url, body, {headers});
    console.log(data)
    if(data.status === 1) {
      setTimeout(() => {
            message.success('회원정보가 성공적으로 수정되었습니다.');
            form.resetFields();
            setLoading(false);
            navigate('/mypage/home')
            dispatch({type: 'mypage_menu', idx : "0"});
      }, 1000);
    }
  };

  return (
    <Layout className='profile-layout'>
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
