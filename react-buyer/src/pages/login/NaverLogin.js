import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';


const NaverLogin = () => {
  // 1. 변수
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");
  const state = queryParams.get("state");
  const dispatch = useDispatch();
  const navigate = useNavigate();



  // 2. 이펙트
  useEffect(() => {
    handleLogin();
  }, [location]);


  // 3. 함수
  const handleLogin = async() => {
    const {data} = await axios.post('/api2/member/naverlogin', { code, state });
    console.log(data);
    if(data.status === 1) {
      console.log("소셜 로그인 성공: ", {
          provider: "naver",
          nickname: data.nickname,
          email: data.email,
          token: data.token
      });
      dispatch({ type: 'login', token : data.token, nickname : data.nickname, userid : data.email });
      navigate('/');
    } else {
      navigate('/login')
    }
      
  }

  return (
    <div>
      
    </div>
  );
};

export default NaverLogin;