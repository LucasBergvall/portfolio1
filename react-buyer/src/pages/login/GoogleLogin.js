import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';

export default function GoogleLoginPage() {
  // 1. 변수
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const query = new URLSearchParams(location.search);
  const code = query.get("code");
  const state = query.get("state");

  // 2. 이펙트
  useEffect(() => {
    if (code) {
      handleLogin(code,state);
    }
  }, [code]);

  // 3. 함수
  const handleLogin = async (code, state) => {
    try {
      const {data} = await axios.post('/api2/member/googlelogin', { code, state });
      console.log("구글 로그인 결과:", data);

      if (data.status === 1) {
        console.log("소셜 로그인 성공: ", {
          provider: "google",
          nickname: data.nickname,
          email: data.email,
          token: data.token
      });
        dispatch({ type: 'login', token: data.token, nickname: data.nickname, userid: data.email });
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error("구글 로그인 실패", err);
      navigate('/login');
    }
  };

  return <div>구글 로그인 처리 중...</div>;
}
