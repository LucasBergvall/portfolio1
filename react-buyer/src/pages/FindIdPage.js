// src/pages/member/FindIdPage.js
import React, { useState } from 'react';
import axios from 'axios';
import './FindIdPage.css';
import CustomFooter from './footer/CustomFooter';

export default function FindIdPage() {
  const [email, setEmail] = useState('');
  const [userid, setUserid] = useState('');
  const [error, setError] = useState('');

  const handleFindId = async (e) => {
    e.preventDefault();
    setUserid('');
    setError('');

    try {
      const response = await axios.post('/api2/member/find-id', { email });
      const data = response.data;

      if (data.status === 1) {
        setUserid(data.userid);
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
      <div className="findid-container">
        <h2>아이디 찾기</h2>
        <form onSubmit={handleFindId} className="findid-form">
          <label htmlFor="email">가입한 이메일</label>
          <input
            type="email"
            id="email"
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">아이디 찾기</button>
        </form>

        {userid && (
          <div className="findid-result">
            ✅ 회원님의 아이디는 <strong>{userid}</strong> 입니다.
          </div>
        )}
        {error && <div className="findid-error">❌ {error}</div>}
      </div>
        <CustomFooter />
    </div>
  );
}
