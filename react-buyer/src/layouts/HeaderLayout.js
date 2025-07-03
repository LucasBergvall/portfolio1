import React, { useEffect, useState } from 'react';
import { Layout, Input, Badge, Button, Menu, Select } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOutlined, 
  ShoppingCartOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  LoginOutlined, 
  IdcardOutlined, 
  MenuOutlined,
  HeartOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import './css/HeaderLayout.css';
import bookmarketLogo from '../assets/bookmarket2.png';
import axios from 'axios';

const { Option } = Select; 
const { Header } = Layout;

export default function HeaderLayout() {
  // 1. 변수
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { nickname, logged } = useSelector((state) => state.LoginReducer);
  const [searchText, setSearchText] = useState('');
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const location = useLocation();
  const [searchType, setSearchType] = useState('title'); // 🔥 기본값: 제목
  const [genreName, setGenreName] = useState([]);
  

  // 2. 이펙트
  useEffect(() => {
    setSearchText('');
  }, [location.pathname]);

  useEffect(() => {
    readGenre();
  }, [])

  // 3. 함수
  const handleSearch = () => {
    if (!searchText.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }
    navigate(`/search?type=${searchType}&keyword=${searchText}`);
  };

  const handleClick = (n) => {
    if (n === 1) navigate('/item/cart');
    else if (n === 2) navigate('/mypage/home');
    else if (n === 3) navigate('/login');
    else if (n === 4) navigate('/join');
    else if (n === 5) navigate('/item/like');
    else if (n === 6) {
      dispatch({ type: 'logout' });
      navigate('/logout');
    }
  };

  const readGenre = async() => {
    const url = `/api2/genre/selectitemlist`
    const {data} = await axios.get(url);
    console.log(data);


    if(data.status === 1) {
      setGenreName(data.list);  
    }
  }

  const handleMenuNavigate = (path) => {
    navigate(path);
    window.location.reload();
  };

  return (
    <Layout>
      {/* 상단 얇은 바 */}
      <div className="top-bar">
        {logged === 0 ? (
          <>
            <span onClick={() => handleClick(4)}>회원가입</span>
            <span onClick={() => handleClick(3)}>로그인</span>
          </>
        ) : null}
      </div>

      {/* 메인 헤더 */}
      <Header className="main-header">
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

        {/* ✅ 수정된 검색바 영역 */}
        <div className="header-center">
          <div className="search-wrapper">
            <select className="search-select" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
              <option value="title">제목</option>
              <option value="writer">작가</option>
              <option value="detail">내용</option>
              <option value="genre">장르</option>
            </select>

            <Input.Search
              placeholder="검색어를 입력하세요"
              enterButton
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              className="search-input"
            />
          </div>
        </div>

        <div className="header-right">
          {logged === 1 ? ( 
          <div className='nickname'>{nickname}님 환영합니다.</div>
          ) : null }
          <Badge count={0}>
            <Button type="text" icon={<HeartOutlined />} className="icon-button" onClick={() => handleClick(5)}>찜한상품</Button>
          </Badge>

          <Badge count={0}>
            <Button type="text" icon={<ShoppingCartOutlined />} className="icon-button" onClick={() => handleClick(1)}>장바구니</Button>
          </Badge>

          {logged === 1 ? (
            <>
              <Button type="text" icon={<UserOutlined />} className="icon-button" onClick={() => handleClick(2)}>마이페이지</Button>
              <Button type="text" icon={<LogoutOutlined />} className="icon-button" onClick={() => handleClick(6)}>로그아웃</Button>
            </>
          ) : null}
        </div>
      </Header>

     
      <div className="category-menu">
        <div className="menu-container">
            
          {/* ✅ 이게 바로 네가 원하는 전체메뉴 버튼 위치 2. category-menu 안에 전체메뉴 버튼 추가*/}
          <button 
            type="button" 
            className={`btn-anb ${megaMenuOpen ? 'open' : ''}`} 
            onClick={() => setMegaMenuOpen(!megaMenuOpen)}
          >
            <span className="hidden">전체메뉴</span>
          </button>

          {/* ✅ 메뉴들은 별도로 Menu 컴포넌트 유지 */}
          <Menu
            mode="horizontal"
            overflowedIndicator={null}
            theme="light"
            selectedKeys={[location.pathname]}  // ✅ 현재 경로로 선택값 유지
            items={[
              { key: "/board", label: "게시판", onClick: () => navigate('/board') },
              { key: "/notice", label: "공지사항", onClick: () => navigate('/notice') },
              { key: "/css", label: "고객센터", onClick: () => navigate('/css') },
              { key: "/event", label: "이벤트", onClick: () => navigate('/event') },
              { key: "/location", label: "찾아오시는 길", onClick: () => navigate('/location') },
            ]}
          />

        </div>
      </div>

      {/* 메가 드롭다운 */}
      {megaMenuOpen && (
        <div className="mega-dropdown">
          <div className="mega-content">
            <div className="column">
              <h4>인문·문학</h4>
              <ul>
                <li onClick={() => handleMenuNavigate(`/genre?no=${genreName[0].no}`)}>{genreName[0].genreName}</li><li onClick={() => handleMenuNavigate(`/genre?no=${genreName[1].no}`)}>{genreName[1].genreName}</li>
                <li onClick={() => handleMenuNavigate(`/genre?no=${genreName[2].no}`)}>{genreName[2].genreName}</li><li onClick={() => handleMenuNavigate(`/genre?no=${genreName[3].no}`)}>{genreName[3].genreName}</li>
                <li onClick={() => handleMenuNavigate(`/genre?no=${genreName[4].no}`)}>{genreName[4].genreName}</li>
              </ul>
              <h4>문화·예술·음악</h4>
              <ul>
                <li onClick={() => handleMenuNavigate(`/genre?no=${genreName[5].no}`)}>{genreName[5].genreName}</li><li onClick={() => handleMenuNavigate(`/genre?no=${genreName[6].no}`)}>{genreName[6].genreName}/대중문화</li>
                <li onClick={() => handleMenuNavigate(`/genre?no=${genreName[7].no}`)}>{genreName[7].genreName}</li>
              </ul>
            </div>

            <div className="column">
              <h4>실용·생활</h4>
              <ul>
                <li onClick={() => handleMenuNavigate(`/genre?no=${genreName[8].no}`)}>{genreName[8].genreName}</li><li onClick={() => handleMenuNavigate(`/genre?no=${genreName[9].no}`)}>{genreName[9].genreName}</li>
                <li onClick={() => handleMenuNavigate(`/genre?no=${genreName[10].no}`)}>{genreName[10].genreName}</li>
              </ul>
              <h4>경제·경영</h4>
              <ul>
                <li onClick={() => handleMenuNavigate(`/genre?no=${genreName[11].no}`)}>{genreName[11].genreName}</li><li onClick={() => handleMenuNavigate(`/genre?no=${genreName[12].no}`)}>{genreName[12].genreName}</li>
                <li onClick={() => handleMenuNavigate(`/genre?no=${genreName[13].no}`)}>{genreName[13].genreName}</li>
              </ul>
            </div>

            <div className="column">
              <h4>과학·IT</h4>
              <ul>
                <li onClick={() => handleMenuNavigate(`/genre?no=${genreName[14].no}`)}>{genreName[14].genreName}</li><li onClick={() => handleMenuNavigate(`/genre?no=${genreName[15].no}`)}>{genreName[15].genreName}</li>
              </ul>
              <h4>역사·사회·시사</h4>
              <ul>
                <li onClick={() => handleMenuNavigate(`/genre?no=${genreName[16].no}`)}>{genreName[16].genreName}</li><li onClick={() => handleMenuNavigate(`/genre?no=${genreName[17].no}`)}>{genreName[17].genreName}</li>
              </ul>
            </div>

            <div className="column">
              <h4>어학·여행·SF/판타지</h4>
              <ul>
                <li onClick={() => handleMenuNavigate(`/genre?no=${genreName[18].no}`)}>{genreName[18].genreName}</li><li onClick={() => handleMenuNavigate(`/genre?no=${genreName[19].no}`)}>{genreName[19].genreName}</li>
                <li onClick={() => handleMenuNavigate(`/genre?no=${genreName[20].no}`)}>{genreName[20].genreName}</li>
              </ul>
              <ul>
                <h4>전체 도서</h4>
                <li onClick={() => handleMenuNavigate(`/allbook`)}>전체도서 목록</li>
              </ul>
            </div>
          </div>
        </div>
      )}
      <div style={{ height: '200px' }}></div>
    </Layout>
  );
}
