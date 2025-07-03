import React, { useState, useEffect } from 'react';
import { Input, Button, Form, Typography, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined, ToolOutlined, RobotOutlined } from '@ant-design/icons';
import './JoinPage.css';
import axios from 'axios';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export default function JoinPage() {
  // 1. 변수
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();


  // 2. 이펙트
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // 3. 함수
  const openAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        form.setFieldsValue({ address: data.address });
      }
    }).open();
  };

  // 중복 상태 저장
  const [duplicate, setDuplicate] = useState({
    nickname: false,
    userid: false,
    email: false,
    phone: false,
  });

  const fieldMap = {
    userid: 'userid',
    nickname: 'nickname',
    email: 'email',
    phone: 'phone',
  };

  // 중복 체크 함수들
  const checkDuplicate = debounce(async (field, value) => {
    if (!value) return;
    try {
      const param = fieldMap[field];
      const url = `/api2/member/check-${field}?${param}=${value}`;
      const res = await axios.get(url);
      setDuplicate(prev => ({ ...prev, [field]: res.data.exists }));

      if (res.data.exists) {
        message.warning(`이미 사용 중인 ${field === 'userid' ? '아이디' : field}입니다.`);
      }
    } catch (err) {
      console.error(`${field} 중복 체크 에러`, err);
    }
  }, 500);


  const goHome = () => {
    window.location.href = '/';
  };

  const checkNickname = async (nickname) => {
    try {
      const res = await axios.get(`/api2/member/check-nickname?nickname=${nickname}`);
      if (res.data.exists) {
        message.warning('이미 사용 중인 닉네임입니다.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onFinish = async (values) => {
    // 하나라도 중복이면 중단
    // if (Object.values(duplicate).includes(true)) {
      // message.error('중복된 항목이 있습니다. 다시 확인해주세요.');
      // return;
    // }

    try {
      setLoading(true);
      const sendData = {
        nickname: values.nickname,
        userid: values.userid,
        password: values.password,
        email: values.email,
        phone: values.phone,
        buyer: 0,
        seller: 1,
        admin: 0
      };
      console.log(sendData);
      const res = await axios.post('/api2/member/join', sendData);

      if (res.data.status === 1) {
        message.success('회원가입 성공!');
        navigate('/login');
      } else {
        message.error(`회원가입 실패: ${res.data.message || '알 수 없는 오류'}`);
      }
    } catch (err) {
      console.error(err);
      message.error('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-page-wrapper">
      <div className="logo-wrapper" onClick={goHome}>
        <div className="logo-text">
          <ToolOutlined style={{ fontSize: '48px', color: '#000000' }} />공구마켓</div>
      </div>

      <div className="join-page">
        <Title level={2}>회원가입</Title>
        <Divider />
        <Form
          form={form}
          name="join"
          onFinish={onFinish}
          className="join-form"
        >
          {/* 닉네임 */}
          <Form.Item
            name="nickname"
            rules={[{ required: true, message: '닉네임을 입력해주세요!' }]}
            validateStatus={duplicate.nickname ? 'error' : ''}
            help={duplicate.nickname ? '이미 사용 중인 닉네임입니다.' : ''}
          >
            <Input
              prefix={<RobotOutlined />}
              placeholder="닉네임"
              onChange={(e) => checkDuplicate('nickname', e.target.value)}
            />
          </Form.Item>

          {/* 아이디 */}
          <Form.Item
            name="userid"
            rules={[{ required: true, message: '아이디를 입력해주세요!' }]}
            validateStatus={duplicate.userid ? 'error' : ''}
            help={duplicate.userid ? '이미 사용 중인 아이디입니다.' : ''}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="아이디"
              onChange={(e) => checkDuplicate('userid', e.target.value)}
            />
          </Form.Item>


          {/* 비밀번호 */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: '비밀번호를 입력해주세요!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="비밀번호" />
          </Form.Item>

          {/* 비밀번호 확인 */}
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '비밀번호 확인을 입력해주세요!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="비밀번호 확인" />
          </Form.Item>

          {/* 이메일 */}
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '이메일을 입력해주세요!' },
              { type: 'email', message: '유효한 이메일을 입력해주세요!' }
            ]}
            validateStatus={duplicate.email ? 'error' : ''}
            help={duplicate.email ? '이미 등록된 이메일입니다.' : ''}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="이메일"
              onChange={(e) => checkDuplicate('email', e.target.value)}
            />
          </Form.Item>

          {/* 전화번호 */}
          <Form.Item
            name="phone"
            rules={[{ required: true, message: '전화번호를 입력해주세요!' }]}
            validateStatus={duplicate.phone ? 'error' : ''}
            help={duplicate.phone ? '이미 등록된 전화번호입니다.' : ''}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="전화번호"
              onChange={(e) => checkDuplicate('phone', e.target.value)}
            />
          </Form.Item>

          {/* 주소 검색 */}
          <Form.Item
            name="address"
            rules={[{ required: true, message: '주소를 검색해주세요!' }]}
          >
            <Input
              prefix={<HomeOutlined />}
              placeholder="주소 검색"
              readOnly
              onClick={openAddressSearch} // ✨ 수정된 부분 (onFocus → onClick)
              style={{ cursor: 'pointer' }}
            />
          </Form.Item>

          {/* 상세 주소 입력 */}
          <Form.Item
            name="detailAddress"
            rules={[{ required: true, message: '상세 주소를 입력해주세요!' }]}
          >
            <Input placeholder="상세 주소 입력" />
          </Form.Item>

          {/* 회원가입 버튼 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="join-btn"
              loading={loading}
              block
            >
              회원가입
            </Button>
          </Form.Item>

          {/* 로그인 링크 */}
          <Form.Item style={{ textAlign: 'center' }}>
            <Text>
              이미 계정이 있으신가요? <a href="/login">로그인</a>
            </Text>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
