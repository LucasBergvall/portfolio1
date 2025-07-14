import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu } from 'antd'
import './AddressPage2.css';

import {
  ShoppingCartOutlined, CloudUploadOutlined, UserOutlined, FileTextOutlined,
  FileSearchOutlined, LoginOutlined, LogoutOutlined, IdcardOutlined, CloudServerOutlined,
} from '@ant-design/icons';

const { Sider } = Layout

const items = [
  { key: '1', label: '마이 페이지', icon: <UserOutlined />, onClick: () => window.location.href = '/mypage' },
  { type: 'divider' },
  { key: '2', label: '로그인', icon: <LoginOutlined />, onClick: () => window.location.href = '/login' },
  { key: '3', label: '로그아웃', icon: <LogoutOutlined />, onClick: () => window.location.href = '/logout' },
  { key: '4', label: '회원가입', icon: <IdcardOutlined />, onClick: () => window.location.href = '/join' },
];

const AddressPage = () => {
  const [savedAddress, setSavedAddress] = useState({ address: '', zonecode: '', detailAddress: '' });
  const [newAddress, setNewAddress] = useState({ address: '', zonecode: '', detailAddress: '' });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate()
  const [showHeader, setShowHeader] = useState(true)
  const [darkMode] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const toggleWrapperRef = useRef(null);
  const [switchOn, setSwitchOn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  const isSeller = location.pathname.includes('/seller');

  const updatedItems = isLoggedIn
    ? items.filter(item => item.key !== '2')
    : items.filter(item => item.key !== '3');

  useEffect(() => {
    // 처음에 기존 주소 불러오기
    fetch('/api/getAddress')
      .then(res => res.json())
      .then(data => {
        setSavedAddress(data);
      })
      .catch(err => console.error('주소 불러오기 실패:', err));

    // 카카오 우편번호 스크립트 추가
    const script = document.createElement('script');
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const openAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setNewAddress(prev => ({
          ...prev,
          address: data.address,
          zonecode: data.zonecode,
        }));
      }
    }).open();
  };

  const handleSave = () => {
    fetch('/api/saveAddress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAddress),
    })
      .then(res => res.json())
      .then(data => {
        alert('주소가 저장되었습니다.');
        setSavedAddress(data);
        setIsEditing(false);
      })
      .catch(err => {
        console.error('주소 저장 실패:', err);
        alert('주소 저장 실패');
      });
  };

  return (

    <Layout className={darkMode ? 'dark-mode' : ''}>
      <Layout style={{ flex: 1 }}>
        <Sider width={250} style={{ background: '#f0f2f5', height: '100vh', paddingTop: '20px' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['6']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1" icon={<UserOutlined />}><Link to="/profile">회원정보 관리</Link></Menu.Item>
            <Menu.Item key="2" icon={<FileTextOutlined />}><Link to="/salehistory">판매내역</Link></Menu.Item>
            <Menu.Item key="3" icon={<ShoppingCartOutlined />}><Link to="/item-register">등록한 상품</Link></Menu.Item>
            <Menu.Item key="4" icon={<CloudUploadOutlined />}><Link to="/item-register-form/tool">공구 등록</Link></Menu.Item>
            <Menu.Item key="5" icon={<CloudServerOutlined />}><Link to="/item-register-form/inverter">인버터 등록</Link></Menu.Item>
            <Menu.Item key="6" icon={<FileSearchOutlined />}><Link to="/address">배송주소 관리</Link></Menu.Item>
            <Menu.Item key="7" icon={<FileSearchOutlined />}><Link to="/ratingpage">나의 평점</Link></Menu.Item>
          </Menu>
        </Sider>
        <div className="address-page-wrapper">
          <h1>배송 주소 관리</h1>

          {/* 기존 주소 표시 */}
          <div className="address-section">
            <h3>현재 등록된 주소</h3>
            <p>우편번호: {savedAddress.zonecode}</p>
            <p>기본주소: {savedAddress.address}</p>
            <p>상세주소: {savedAddress.detailAddress}</p>
            <button className='address-btn' onClick={() => setIsEditing(true)} style={{background: '#F7C600', color: '#000000'}}>수정하기</button>
          </div>

          {/* 수정 모드 */}
          {isEditing && (
            <div className="edit-section">
              <h3>주소 수정</h3>

              <div className="address-row">
                <input
                  type="text"
                  placeholder="우편번호"
                  value={newAddress.zonecode}
                  readOnly
                />
                <button className="address-search-btn" onClick={openAddressSearch}>주소 검색</button>
              </div>

              <div className="address-row">
                <input
                  type="text"
                  placeholder="기본 주소"
                  value={newAddress.address}
                  readOnly
                />
              </div>

              <div className="address-row">
                <input
                  type="text"
                  placeholder="상세 주소 입력"
                  value={newAddress.detailAddress}
                  onChange={(e) => setNewAddress({ ...newAddress, detailAddress: e.target.value })}
                />
              </div>

              <div className="address-submit">
                <button className="address-save-btn" onClick={handleSave}>저장하기</button>
                <button className="address-cancel-btn" onClick={() => setIsEditing(false)}>취소</button>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </Layout>
  );
};

export default AddressPage;