import React, { useState, useRef, useEffect } from 'react';
import { Button,Layout } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import {BookOutlined, DownOutlined, UpOutlined, LoginOutlined, LogoutOutlined, IdcardOutlined, CloseOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';

const { Header } = Layout;




export default function Header() {

  // 1. 변수
  const navigate = useNavigate();
  const location = useLocation();
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const toggleWrapperRef = useRef(null);
  const [darkMode] = useState(false);

  const { token, nickname } = useSelector((state) => state.LoginReducer);
  const dispatch = useDispatch();
  

  // 2. 이펙트
  useEffect(() => {
      console.log("bb", token)
  }, [token]); // ✅ token이 바뀔 때마다 실행


   // 3. 함수
  const handleClick = (n) => {
    // ① 함수 실행
    console.log('함수 실행');
    // 예: dispatch나 Redux 상태 저장 등
    if (n === 1) {
    dispatch({ type: 'item_menu', idx: '2' });  // 찜한상품 클릭 시 Redux 업데이트
    navigate('/item/like');
    } else if (n === 2) {
      dispatch({ type: 'item_menu', idx: '3' });  // 장바구니 클릭 시 Redux 업데이트
      navigate('/item/cart');
    } else if (n === 3) {
      navigate('/mypage/home');
    } else if (n === 4) {
      navigate('/login');
    } else if (n === 5) {
      navigate('/join');
    } else if (n === 6) {
      dispatch({ type: 'logout' });
      navigate('/logout');
    }
    
  };

 

  return(
    <Layout className={darkMode ? 'dark-mode' : ''}>
          <Header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000, backgroundColor: '#001529', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
            <div style={{ color: '#fff', fontSize: '22px', display: 'flex', alignItems: 'center' }} ref={toggleWrapperRef}>
              
              <Link to="/" style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <BookOutlined style={{ marginRight: 6 }} />서적마켓
              </Link>
              <Button type="text" style={{ color: '#fff', marginLeft: '10px' }} icon={showMegaMenu ? <UpOutlined /> : <DownOutlined />} onClick={() => setShowMegaMenu(prev => !prev)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: '#fff' }}>
              {nickname && (
                <span style={{ fontWeight: 'bold', color: '#fff', marginRight: '10px' }}>
                  {nickname}님 환영합니다
                </span>
              )}
              {token && (
                <>
                  <div
                    onClick={() => handleClick(1)}
                    style={{ cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
                  >
                    찜한상품
                  </div>
                  <div
                    onClick={() => handleClick(2)}
                    style={{ cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
                  >
                    장바구니
                  </div>
                  <div
                    onClick={() => handleClick(3)}
                    style={{ cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
                  >
                    마이페이지
                  </div>
                </>
              )}
              {/* ✅ 로그인/로그아웃 조건 분기 (순서 바꿈) */}
              {!token ? (
                <>
                  <div 
                    onClick={() => handleClick(4)}
                    style={{ cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
                  >
                    <LoginOutlined style={{ marginRight: 6 }} />로그인
                  </div>

                  <div 
                    onClick={() => handleClick(5)}
                    style={{ cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
                  >
                    <IdcardOutlined style={{ marginRight: 6 }} />회원가입
                  </div>
                </>
              ) : (
                <div
                  onClick={() => handleClick(6)}
                  style={{ cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}
                >
                  <LogoutOutlined style={{ marginRight: 6, color: '#fff' }} />로그아웃
                </div>
              )}
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
              <div style={{ display: 'flex', gap: '80px' }}>
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