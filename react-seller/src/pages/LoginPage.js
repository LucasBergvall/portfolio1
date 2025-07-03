import React, { useState } from 'react';
import { Input, Button, Form, Typography, message, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, ToolOutlined, BookTwoTone, BookOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import './LoginPage.css';
import Chat from './Chat'; // 파일 경로에 맞게 조정 필요
import axios from 'axios'; // 상단에 추가

// 로고 이미지 import
import naverLogo from '../assets/naver-logo.png';
import kakaoLogo from '../assets/kakao-logo.png';
import googleLogo from '../assets/google-logo.png';

const { Title, Text } = Typography;

export default function LoginPage() {
  // 1. 변수
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  // 2. 이펙트
  


  // 3. 함수
  const goHome = () => {
    navigate('/');
  };

  const handleKakaoLogin = () => {
    console.log('카카오 로그인 시도');
  };

  const handleNaverLogin = () => {
    console.log('네이버 로그인 시도');
  };

  const handleGoogleLogin = () => {
    console.log('구글 로그인 시도');
  };

  

  const onFinish = async (values) => {
    setLoading(true);
    try {
     const res = await axios.post('/api2/member/login', {
      userid: values.username,
      password: values.password
      }, {
        withCredentials: true  // ✅ 이 옵션은 쿠키나 세션을 사용하는 경우만!
      });

      if (res.data.status === 1) {
        console.log(res.data)

        // ✅ 리덕스 로그인 처리 (선택)
        dispatch({ type: 'login', token : res.data.token, nickname : res.data.nickname });
        
        message.success('로그인 성공!');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        // ❌ 로그인 실패 메시지
        message.error(res.data.message || '로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      message.error('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
    

  return (
    <div className="login-page-wrapper">
      <div className="logo-wrapper" onClick={goHome}>
        <div className="logo-text">
          <BookOutlined style={{ fontSize: '48px', color: '#000000' }} />서적마켓</div>
      </div>

      
      <div className="login-page">
        <Title level={2} >로그인</Title>
        <Divider />
        <Form
          name="login"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          className="login-form"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '아이디를 입력해주세요!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="아이디"
              className="login-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '비밀번호를 입력해주세요!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="비밀번호"
              className="login-input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              block
              htmlType="submit"
              className="login-btn"
              loading={loading}
            >
              로그인
            </Button>
          </Form.Item>

          {/* 소셜 로그인 로고들 */}
          <Form.Item>
            <div className="social-login-icons">
              <img
                src={kakaoLogo}
                alt="kakao"
                className="social-icon"
                onClick={handleKakaoLogin}
              />
              <img
                src={naverLogo}
                alt="naver"
                className="social-icon"
                onClick={handleNaverLogin}
              />
              <img
                src={googleLogo}
                alt="google"
                className="social-icon"
                onClick={handleGoogleLogin}
              />
            </div>
          </Form.Item>

          <Form.Item className="login-links">
            <div>
              <a href="/find-id" className="login-link">아이디 찾기</a> | <a href="/find-password" className="login-link">비밀번호 찾기</a>
            </div>
          </Form.Item>

          <Form.Item>
            <Text>
              아직 계정이 없으신가요? <a href="/join">회원가입</a>
            </Text>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
