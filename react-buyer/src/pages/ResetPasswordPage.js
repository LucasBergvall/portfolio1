// src/pages/member/ResetPasswordPage.js
import React, { useState } from 'react';
import axios from 'axios';
import './ResetPasswordPage.css';
import CustomFooter from './footer/CustomFooter';

export default function ResetPasswordPage() {
  const [userid, setUserid] = useState('');
  const [email, setEmail] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setTempPassword('');
    setError('');

    try {
      const response = await axios.put('/api2/member/reset-password', {
        userid,
        email,
      });
      const data = response.data;

      if (data.status === 1) {
        setTempPassword(data.tempPassword);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
      console.error(err);
    }
  };

  return (
    <div className='all-container'>
      <div className="resetpw-container">
        <h2>비밀번호 재설정</h2>
        <form onSubmit={handleResetPassword} className="resetpw-form">
          <label htmlFor="userid">아이디</label>
          <input
            type="text"
            id="userid"
            placeholder="아이디 입력"
            value={userid}
            onChange={(e) => setUserid(e.target.value)}
            required
          />
          <label htmlFor="email">가입한 이메일</label>
          <input
            type="email"
            id="email"
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">임시 비밀번호 받기</button>
        </form>

        {tempPassword && (
          <div className="resetpw-result">
            ✅ 임시 비밀번호: <strong>{tempPassword}</strong>  
            <br />로그인 후 꼭 변경해주세요.
          </div>
        )}
        {error && <div className="resetpw-error">❌ {error}</div>}
      </div>
      <CustomFooter />
    </div>
  );
}
