import React, { useState, useRef, useEffect } from 'react';
import { Card, Progress, Button,Layout, Menu, Space, Dropdown, Switch } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import {
  ShoppingCartOutlined, UserOutlined, FileTextOutlined,ToolOutlined, CloudUploadOutlined,
  DownOutlined, UpOutlined, LoginOutlined, LogoutOutlined, IdcardOutlined, CloseOutlined,BookOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import bookmarketLogo from '../assets/bookmarket2.png';
import './css/HeaderLayout.css';

const { Header, Sider } = Layout;

export default function HeaderLayout() {
  // 1.
  const { token, nickname } = useSelector((state) => state.LoginReducer);
  const navigate = useNavigate();
  const location = useLocation();
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const toggleWrapperRef = useRef(null);
  const [darkMode] = useState(false);
  // const [nickname, setNickname] = useState('');
  const dispatch = useDispatch();
  console.log(nickname);


  // 2. 이펙트
    useEffect(() => {
      console.log("bb", token)
      
    }, [token]); // ✅ token이 바뀔 때마다 실행

  // 3. 함수
  const handleClick = (n) => {
    // ① 함수 실행
    console.log('함수 실행');
    // 예: dispatch나 Redux 상태 저장 등
    if(n === 1) {
      dispatch({type: 'item_menu', idx : "1"});
      // ② 이동 
      navigate('/item/select');
    } else if(n === 2) {
      navigate('/sale/list');
    } else if(n === 3 ) {
      navigate('/guest/profile');
    } else if(n === 4) {
      navigate('/mypage/home')
      dispatch({type: 'mypage_menu', idx : "0"});
    } else if(n === 5) {
      navigate('/logout')
    }

  };


  // 4. html렌더링
  return(
    <Layout className={darkMode ? 'dark-mode' : ''}>
          <Header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, backgroundColor: '#001529', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
            <div style={{ color: '#fff', fontSize: '22px', display: 'flex', alignItems: 'center' }} ref={toggleWrapperRef}>
                <div className="header-left">
                  <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center' }}>
                  <img 
                    src={bookmarketLogo} 
                    alt="서적마켓 로고" 
                    style={{ width: '50px', height: '60px', marginRight: '15px' }}
                  />
                    {/* <BookOutlined className="logo-icon" /> */}
                    <span style={{ fontSize: '20px', fontWeight: 'bold' }}>서적마켓</span>
                  </Link>
                </div>
              <Button type="text" style={{ color: '#fff', marginLeft: '10px' }} icon={showMegaMenu ? <UpOutlined /> : <DownOutlined />} onClick={() => setShowMegaMenu(prev => !prev)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: '#fff' }}>
              {nickname && (
                <span style={{ fontWeight: 'bold', color: '#fff', marginRight: '10px' }}>
                  {nickname}님 환영합니다
                </span>
              )}
              <div
                onClick={()=>handleClick(1)}
                style={{ cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
              >
                <FileTextOutlined style={{ marginRight: 6, color: '#fff' }} />상품관리</div>

              <div
                onClick={()=>handleClick(2)}
                style={{ cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
              >
                <ShoppingCartOutlined style={{ marginRight: 6, color: '#fff' }} />판매관리</div>
              <div
                onClick={()=>handleClick(3)}
                style={{ cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
              >
                <CloudUploadOutlined style={{ marginRight: 6, color: '#fff' }} />고객관리</div>
              <div
                onClick={()=>handleClick(4)}
                style={{ cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
              >
                <UserOutlined style={{ marginRight: 6, color: '#fff' }} />마이페이지</div>
                <div
                onClick={()=>handleClick(5)}
                style={{ cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
              >
                <LogoutOutlined style={{ marginRight: 6, color: '#fff' }} />로그아웃</div>   
            </div>
          </Header>
        
          <div style={{ height: '64px' }}></div>
        
          {showMegaMenu && (
            <div style={{
              position: 'fixed',
              top: '64px',
              left: 0,
              width: '100%',
              background: '#fff',
              padding: '40px 80px',
              display: 'flex',
              justifyContent: 'space-between',
              zIndex: 999,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              animation: 'fadeDown 0.3s ease-in-out'
            }}>
              <Button icon={<CloseOutlined />} onClick={() => setShowMegaMenu(false)} style={{ position: 'absolute', top: '16px', right: '24px', background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer' }} />
              <div className="link-button" style={{ display: 'flex', gap: '80px' }}>
                {[{
                  title: '커뮤니티', items: [
                    { label: '게시판', link: '/board' },
                    { label: '공지사항', link: '/notice' },
                    { label: '문의사항' },
                  ]
                }, {
                  title: '이벤트', items: [
                    { label: '진행중 이벤트', link: '/event' },
                    { label: '지난 이벤트', link: '/pastevent' },
                  ]
                }, {
                  title: '정보', items: [
                    { label: '찾아 오시는 길', link: '/location' },
                    { label: '고객센터', link : '/css' },
                  ]
                }].map((category, idx) => (
                  <div key={idx}>
                    <div style={{ background: '#f5f5f5', borderRadius: '12px', padding: '12px 20px', marginBottom: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '16px', color: '#000' }}>{category.title}</div>
                    <div style={{ color: '#000', fontSize: '14px' }}>
                      {category.items.map((item, i) => (
                        <p
                          key={i}
                          className="mega-menu-item"
                          onMouseDown={(e) => e.stopPropagation()} // ✅ 메뉴 닫힘 이벤트 막기
                          onClick={() => {
                            if (item.link) {
                              navigate(item.link);
                              setShowMegaMenu(false); // 바로 닫아도 이제 문제 없음
                            }
                          }}
                        >
                          {item.label}
                          </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
    </Layout>
  );
}