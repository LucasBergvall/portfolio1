import React, { useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { useSelector, Provider, useDispatch } from 'react-redux';

// Board Pages 
import BoardPage from "./pages/board/BoardPage";
import BoardWritePage from "./pages/board/BoardWritePage";
import BoardDetailPage from "./pages/board/BoardDetailPage";
import BoardEditPage from "./pages/board/BoardEditPage";

// Notice Pages 
import NoticePage from "./pages/notice/NoticePage";
import NoticeWritePage from "./pages/notice/NoticeWritePage";
import NoticeDetailPage from "./pages/notice/NoticeDetailPage";
import NoticeEditPage from "./pages/notice/NoticeEditPage";

// EventPage
import EventPage from "./pages/event/EventPage";
import DiscountEventPage from "./pages/event/DiscountEventPage";
import OnePlusOneEventPage from "./pages/event/OnePlusOneEventPage";
import PastEventPage from "./pages/event/PastEventPage";
import NewLaunchEventPage from "./pages/event/NewLaunchEventPage";
import PreOrderPage from "./pages/event/PreOrderPage";

// ItemPage
import CheckoutPage from "./pages/item/CheckoutPage";
import LikePage from "./pages/item/LikePage";
import CartPage from "./pages/item/CartPage";
import PurchaseHistory from "./pages/item/PurchaseHistory1";
import ItemDetailPage from "./pages/item/ItemDetailPage";

// MyPage
import MyPageHome from "./pages/mypage/MyPageHome";
import MyPage from "./pages/MyPage";

// ChatPage
import ChatPage2 from "./pages/chat/ChatPage2";
import Chat from "./pages/chat/Chat";
import ChatPage from "./pages/chat/ChatPage";
import ChatPage3 from "./pages/chat/ChatPage3";
import ChatPage5 from "./pages/chat/ChatPage5"

// CSSPage
import CSSPage from "./pages/csspage/CSSPage";
import InquiryPage from "./pages/csspage/InquiryPage";

import LocationPage from "./pages/LocationPage";

// BestSellerPage
import BestSellerDetailPage from "./pages/bestseller/BestSellerDetailPage";



import BuyerPage from "./pages/BuyerPage";
import Profile from "./pages/mypage/Profile";
import LoginPage from "./pages/LoginPage";
import JoinPage from "./pages/JoinPage";
import HeaderLayout from "../src/layouts/HeaderLayout";
import AddressPage from "./pages/mypage/AddressPage";
import ChangePw from "./pages/mypage/ChangePw";
import UserOut from "./pages/mypage/UserOut";
import LogoutPage from "./pages/LogoutPage";
import axios from "axios";
import ItemPage from "./pages/ItemPage";
import GenrePage from "./pages/GenrePage";
import AllBookPage from "./pages/AllBookPage";
import NaverLogin from "./pages/login/NaverLogin";
import KakaoLogin from "./pages/login/KakaoLogin";
import GoogleLogin from "./pages/login/GoogleLogin";
import PublisherRecommendSlide from "./pages/recommend/PublisherRecommendSlide";
import PublisherRecommendDetailPage from "./pages/recommend/PublisherRecommendDetailPage";
import MdRecommendSlide from "./pages/recommend/MdRecommendSlide";
import MdRecommendDetailPage from "./pages/recommend/MdRecommendDetailPage";
import KakaoPay from "./pages/item/KakaoPay";
import BuyHistory from "./pages/mypage/BuyHistory";
import ReviewWritePage from "./pages/mypage/ReviewWritePage";
import ReviewListPage from "./pages/mypage/ReviewListPage";
import SearchResultPage from "./pages/search/SearchResultPage";
import MagazineDetailPage from "./pages/item/MagazineDetailPage";
import FindIdPage from "./pages/FindIdPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Mqtt from "./pages/Mqtt";

const App = () => {

  // 1. 변수
  // 값을 가져오기 LoginReducer.js에서 변수 logged, token
  // const { logged, token } = useSelector((state) => state.LoginReducer);
  const location = useLocation();
  // 로그인, 회원가입 페이지에서는 HeaderLayout 숨기기
  const { logged, token, userid } = useSelector((state) => state.LoginReducer);
  const hideHeaderRoutes = ["/login", "/join", "/chat", "/chat2", "/chat3", "/chat4"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);
  const dispatch = useDispatch();
  console.log(userid);
  
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
        dispatch({type: 'nickname', "nickname": data.nickname, "userid": data.userid})
      }
    }
  } 

  return (
    <>
      {!shouldHideHeader && <HeaderLayout />}
      <div>
        <Routes>
          {/* MyPage */}
          <Route path='/mypage' element={logged === 1 ? <MyPage /> : <Navigate to="/login" replace />}>
            <Route path="home" element={<MyPageHome />} />
            <Route path="profile" element={<Profile />} />
            <Route path="address" element={<AddressPage />} />
            <Route path="changepw" element={<ChangePw />} />
            <Route path="userout" element={<UserOut />} />
            <Route path="buyhistory" element={<BuyHistory />} />
            <Route path="review-write" element={<ReviewWritePage />} />
            <Route path="/mypage/review-list" element={<ReviewListPage />} />
          </Route>

          {/* Item */}
          <Route path='/item' element={logged === 1 ? <ItemPage /> : <Navigate to="/login" replace />}>
            <Route path="/item/like" element={<LikePage />} />
            <Route path="/item/cart" element={<CartPage />} />
            <Route path="/item/purchase-history" element={<PurchaseHistory />} />
          </Route>
          <Route path="/item/item-detail" element={<ItemDetailPage />} />
          <Route path="item/magazine-detail" element={<MagazineDetailPage />} />

          {/* Board */}
          <Route path='/board' element={<BoardPage />} /> 
          <Route path="/board-write" element={<BoardWritePage />} />
          <Route path="/board-detail" element={<BoardDetailPage />} />
          <Route path="/board-edit" element={<BoardEditPage />} />

          {/* Notice */}
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/notice-write" element={<NoticeWritePage />} />
          <Route path="notice-detail" element={<NoticeDetailPage />} />
          <Route path="/notice-edit" element={<NoticeEditPage />} />

          {/* Event */}
          <Route path="/event" element={<EventPage />} />
          <Route path="/event/discount" element={<DiscountEventPage />} />
          <Route path="/event/oneplusone" element={<OnePlusOneEventPage />} />
          <Route path="/event/pastevent" element={<PastEventPage />} />
          <Route path="/event/launch" element={<NewLaunchEventPage />} />
          <Route path="/preorder" element={<PreOrderPage />} />

          {/* Chat */}
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat2" element={<ChatPage2 />} />
          <Route path="/chat3" element={<Chat />} />
          <Route path="/chat4" element={<ChatPage3 />} />
          <Route path="/chat5" element={<ChatPage5 />} /> 

          {/* Mqtt */}
          <Route path="/mqtt" element={<Mqtt />} />

          {/* CSSPage */}
          <Route path="/css" element={<CSSPage />} />
          <Route path="/inquiry-page" element={<InquiryPage />} />

          {/* BestSeller */}
          <Route path="/bestseller-detail" element={<BestSellerDetailPage />} />

          {/* GenrePage */}
          <Route path="/genre" element={<GenrePage />} />
          <Route path="/allbook" element={<AllBookPage />} /> 

          {/* Login */}
          <Route path="/naver_login" element={<NaverLogin />} />
          <Route path="/kakaologin" element={<KakaoLogin />} />
          <Route path="/googlelogin" element={<GoogleLogin />} />

          {/* 추천도서 */}
          <Route path="/publisher" element={<PublisherRecommendSlide />} />
          <Route path="/publisher-recommend-detail" element={<PublisherRecommendDetailPage />} />
          <Route path="/mdrecommend" element={<MdRecommendSlide />} />
          <Route path="/mdrecommend-detail" element={<MdRecommendDetailPage />} />

          {/* 결제 */}
          <Route path="/kakaopay/completed" element={<KakaoPay />} />

          {/* 검색 */}
          <Route path="/search" element={<SearchResultPage />} />
          
          
          <Route path="/" element={<BuyerPage />} />
          <Route path='/logout' element={logged === 1 ? <LogoutPage /> : <Navigate to="/" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/location" element={<LocationPage />} />
          <Route path="/headerlayout" element={<HeaderLayout />} />
          <Route path="/find-id" element={<FindIdPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
        </Routes>
      </div>
    </>
  );
};

export default App;
