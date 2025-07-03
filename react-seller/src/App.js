import React, { useEffect, useState } from 'react';
import {Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import SellerPage from './pages/SellerPage';
import MyPage from './pages/MyPage';
import LoginPage from './pages/LoginPage';
import JoinPage from './pages/JoinPage';
import HeaderLayout from './layouts/HeaderLayout';
import LogoutPage from './pages/LogoutPage';
import ItemRegisterPage from './pages/item/ItemRegisterPage';
import BookRegisterPage from './pages/item/BookRegisterPage';
import SalePage from './pages/SalePage';
import GuestPage1 from './pages/GuestPage1';
import ItemPage from './pages/ItemPage';
import BookUpdatePage from './pages/item/BookUpdatePage';
import ItemDeletePage from './pages/item/ItemDeletePage';
import SaleHistory from './pages/sale/SaleHistory';
import RatingPage from './pages/sale/RatingPage';
import GuestProfile from './pages/guest/GuestProfile';
import Profile from './pages/mypage/Profile';
import ChangePw from './pages/mypage/ChangePw';
import MyPage2 from './pages/mypage/MyPage2';
import Address from './pages/mypage/Address';
import ItemDetailSellerPage from './pages/item/ItemDetailSellerPage';
import BoardPage from './pages/board/BoardPage';
import axios from 'axios';
import BoardWritePage from './pages/board/BoardWritePage';
import BoardEditPage from './pages/board/BoardEditPage';
import BoardDetailPage from './pages/board/BoardDetailPage';
import NoticePage from './pages/notice/NoticePage';
import NoticeDetailPage from './pages/notice/NoticeDetailPage';
import NoticeWritePage from './pages/notice/NoticeWritePage';
import NoticeEditPage from './pages/notice/NoticeEditPage';
import LocationPage from './pages/LocationPage';




const App = () => {

  // 1. 변수
  // 값을 가져오기 LoginReducer.js에서 변수 logged, token
  const { logged, token } = useSelector((state) => state.LoginReducer);
  const location = useLocation();
  // 로그인, 회원가입 페이지에서는 HeaderLayout 숨기기
  const hideHeaderRoutes = ["/login", "/join"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);
  const [itemList, setItemList] = useState([]);
  const dispatch = useDispatch();

  // 2. 함수
  useEffect(() => {
    getNickname();
  },[])

  // 3. 함수
  
  const getNickname = async() => {
    if(logged === 1) {
    const url = `/api2/member/getnickname`
    const headers = { Authorization: `Bearer ${token}` }
    const { data } = await axios.get(url, {headers});
    console.log(data);
      if(data.status === 1) {
        dispatch({type: 'nickname', "nickname": data.nickname})
      }
    }
  }

  return (
    <>
      {!shouldHideHeader && <HeaderLayout />}
      <div>
        <Routes>
          <Route path="/" element={logged === 1 ? <SellerPage /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={logged === 0 && <LoginPage/>} />
          <Route path="/join" element={logged === 0 && <JoinPage/>} />
          <Route path='/logout' element={logged === 1 ? <LogoutPage /> : <Navigate to="/login" replace />} />
          <Route path='/location' element={<LocationPage />} />

          {/* item */}
          <Route path="/item" element={logged === 1 ? <ItemPage/> : <Navigate to="/login" replace />}>
            <Route path="select" element={<ItemRegisterPage/>} />
            <Route path="insert" element={<BookRegisterPage/>} />
            <Route path="update" element={<BookUpdatePage/>} />
            <Route path="delete" element={<ItemDeletePage/>} />
            <Route path="detail" element={<ItemDetailSellerPage/>} />
          </Route>
          {/* sale */}
          <Route path='/sale' element={logged === 1 ? <SalePage/>: <Navigate to="/login" replace />}>
            <Route path="list" element={<SaleHistory/>} />
            <Route path="rating" element={<RatingPage/>} />
          </Route>

          {/* guest */}
          <Route path='/guest' element={logged === 1 ? <GuestPage1/>: <Navigate to="/login" replace />}>
            <Route path="profile" element={<GuestProfile/>} />
          </Route>

          {/* mypage */}
          <Route path='/mypage' element={logged === 1 ? <MyPage/>: <Navigate to="/login" replace />}>
            <Route path="home" element={<MyPage2/>} />
            <Route path='address' element={<Address/> } />
            <Route path="profile" element={<Profile/>} />
            <Route path="changepw" element={<ChangePw/>} />
          </Route>

          {/* board */}
          <Route path="/board" element={<BoardPage />} />
          <Route path='/board-write' element={<BoardWritePage />} />
          <Route path='/board-edit' element={<BoardEditPage />} />
          <Route path='/board-detail' element={<BoardDetailPage />} />

          {/* notice */}
          <Route path='notice' element={<NoticePage />} />
          <Route path='/notice-detail' element={<NoticeDetailPage />} />
          <Route path='/notice-write' element={<NoticeWritePage />} />
          <Route path='/notice-edit' element={<NoticeEditPage />} />
        </Routes>    
      </div>
    </>
  );
};

export default App; 