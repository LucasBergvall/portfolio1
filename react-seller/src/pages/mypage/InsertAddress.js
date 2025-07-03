import React, { useState } from 'react';
import './css/InsertAddress.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function InsertAddress({ onClose, onSuccess }) {
  // 1. 변수
  const [address, setAddress] = useState('');
  const [detail, setDetail] = useState('');
  const { token } = useSelector(state => state.LoginReducer);

  // 2. 이펙트


  // 3. 함수
  const openDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setAddress(data.address);
      }
    }).open();
  };

  const handleSubmit = async () => {
    if (!address || !detail) return alert("주소와 상세주소를 입력하세요.");

    try {
      const url = `/api2/address/add`;
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const body = {
        address: address,
        address_detail: detail,
        postno: 0 // 필요시 값 넣기
      };

      const { data } = await axios.post(url, body, { headers });
      console.log('📦 주소 등록 성공:', data);
      alert("주소 등록 완료");

      onSuccess && onSuccess(); // ✅ 이 줄이 핵심!
      onClose(); // 모달 닫기
    } catch (e) {
      console.error('❌ 주소 등록 실패:', e);
      alert("등록 실패");
    }
  };

  return (
    <div className="insert-address-modal">
      <div className="insert-address-content">
        <h3>배송지 등록</h3>
        <input
          type="text"
          placeholder="주소 검색"
          value={address}
          readOnly
          onClick={openDaumPostcode}
        />
        <input
          type="text"
          placeholder="상세 주소 입력"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />
        <div className="insert-address-buttons">
          <button onClick={handleSubmit}>등록</button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}
