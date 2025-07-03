import React, { useState, useRef, useEffect } from 'react';
import { Layout, Button, Switch, Dropdown, Space, Input } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './LocationPage.css';
import {
  ShoppingCartOutlined, HeartOutlined, UserOutlined, BookOutlined,
  DownOutlined, UpOutlined, LoginOutlined, LogoutOutlined,
  IdcardOutlined, CloseOutlined
} from '@ant-design/icons';
import CustomFooter from './footer/CustomFooter';

const { Header } = Layout;

const items = [
  { key: '1', label: '마이 페이지', icon: <UserOutlined />, onClick: () => window.location.href = '/mypage' },
  { type: 'divider' },
  { key: '2', label: '로그인', icon: <LoginOutlined />, onClick: () => window.location.href = '/login' },
  { key: '3', label: '로그아웃', icon: <LogoutOutlined />, onClick: () => window.location.href = '/logout' },
  { key: '4', label: '회원가입', icon: <IdcardOutlined />, onClick: () => window.location.href = '/join' },
];

export default function LocationPage() {
  const navigate = useNavigate();
  const [roadviewVisible, setRoadviewVisible] = useState(false); // 추가
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const [switchOn, setSwitchOn] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [searchText, setSearchText] = useState('');
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const toggleWrapperRef = useRef(null);
  const roadviewRef = useRef(null);
  const rvClientRef = useRef(null);
  const markers = useRef([]);
  const updatedItems = isLoggedIn ? items.filter(i => i.key !== '2') : items.filter(i => i.key !== '3');

  useEffect(() => {
  const script = document.createElement('script');
  script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=a6a4254054de619326c95a7b48f9c2c4&libraries=services&autoload=false";
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    window.kakao.maps.load(() => {
      const center = new window.kakao.maps.LatLng(35.13279132700143, 129.10692969560796); // 부경대 창의관
      const map = new window.kakao.maps.Map(document.getElementById('map'), {
        center,
        level: 4,
      });
      mapRef.current = map;

      const roadview = new window.kakao.maps.Roadview(document.getElementById('roadview'));
      const rvClient = new window.kakao.maps.RoadviewClient();
      roadviewRef.current = roadview;
      rvClientRef.current = rvClient;

      const marker = new window.kakao.maps.Marker({
        map,
        position: center,
      });
      markerRef.current = marker;

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:6px;font-size:14px;">📍 부경대 창의관</div>`,
      });
      infowindow.open(map, marker);

      // 👉 마커 클릭 시 로드뷰 출력
     window.kakao.maps.event.addListener(marker, 'click', () => {
        rvClient.getNearestPanoId(center, 50, (panoId) => {
          if (panoId) {
            setRoadviewVisible(true);  // 로드뷰 영역 보이기

            // panoId 설정 먼저
            roadview.setPanoId(panoId, center);

            // 이벤트로 viewpoint 설정
            window.kakao.maps.event.addListener(roadview, 'pano_changed', function onPanoChanged() {
              // viewpoint 조정
              const viewpoint = new window.kakao.maps.Viewpoint({
                pan: 0,
                tilt: 0,
                zoom: 0
              });
              roadview.setViewpoint(viewpoint);

              // 이 이벤트는 한 번만 실행되도록 제거
              window.kakao.maps.event.removeListener(roadview, 'pano_changed', onPanoChanged);
            });

          } else {
            alert('해당 위치에 로드뷰가 없습니다.');
          }
        });
      });
    });
  };
}, []);


  const handlePlaceSearch = () => {
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchText, (data, status) => {
      if (status !== window.kakao.maps.services.Status.OK) {
        alert('장소를 찾을 수 없습니다.');
        return;
      }

      markers.current.forEach(m => m.setMap(null));
      markers.current = [];

      const bounds = new window.kakao.maps.LatLngBounds();
      data.forEach(place => {
        const pos = new window.kakao.maps.LatLng(place.y, place.x);
        const marker = new window.kakao.maps.Marker({ map: mapRef.current, position: pos });
        markers.current.push(marker);
        bounds.extend(pos);
      });

      mapRef.current.setBounds(bounds);
    });
  };

  return (
    <div className="location-wrapper">
      <div className="all-area">
        <div className="map-area">
          <div id="map" className="map"></div>

          <div id="roadview" className={`roadview ${roadviewVisible ? 'show' : ''}`}>
            {roadviewVisible && (
              <button
                className="close-roadview-btn"
                onClick={() => setRoadviewVisible(false)}
                style={{ color: '#000000' }}
              >
                ✕ 닫기
              </button>
            )}
          </div>
        </div>
      </div>
      <CustomFooter />
    </div>
  );
}