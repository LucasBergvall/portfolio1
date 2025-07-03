import React, { useEffect, useState } from 'react';
import { Card, Button, Image, Divider, Tabs, message, Layout, List } from 'antd';
import {
  HeartFilled,
  HeartOutlined,
  ShoppingCartOutlined,
  EditOutlined
} from '@ant-design/icons';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './css/ItemDetailSellerPage.css';
import { useSelector } from 'react-redux';

const { Content, Footer } = Layout;

export default function ItemDetailSellerPage() {
  // 1. 변수
  const { no } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itemNo = queryParams.get('no');
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [mainImg, setMainImg] = useState('');
  const [favorites, setFavorites] = useState({});
  const { token } = useSelector((state) => state.LoginReducer);

  // 2. 이펙트
  useEffect(() => {
    selectItem();
  }, []);

  // 3. 함수
  const selectItem = async () => {
    try {
      const url = `/api2/item/select?no=${itemNo}`;
      const { data } = await axios.get(url);
      console.log(data);
      if (data.status === 1) {
        setItem(data.item);
        setMainImg(data.item.imgUrlList?.[0] || '');
      } else {
        message.error(data.message || '상품을 불러오지 못했습니다.');
      }
    } catch (err) {
      console.error(err);
      message.error('서버 오류');
    }
  };

  const handleEdit = (no) => {
    navigate(`/item/update?no=${no}`);
  };

  const handleDelete = async (no) => {
    try {
      const confirmed = window.confirm('정말 삭제하시겠습니까?');
      if (!confirmed) return;

      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.put(`/api2/item/delete`, { "no" : no }, { headers });

      if (data.status === 1) {
        message.success('삭제되었습니다.');
        navigate('/item/select');
      } else {
        message.error(data.message || '삭제 실패');
      }
    } catch (err) {
      console.error(err);
      message.error('서버 오류');
    }
  };

  return (
    <Layout>
      <Content className="item-detail-container">
        {!item ? (
          <p>상품 정보를 불러오는 중입니다...</p>
        ) : (
          <div className="item-card">
            {/* 이미지 섹션 */}
            <div className="image-gallery">
             <Image
              className="main-image"
              src={mainImg}
              alt="대표 이미지"
              preview={false}
            />
              <div className="thumbnail-list">
                {item.imgUrlList?.map((url, idx) => (
                  <Image
                    key={idx}
                    width={60}
                    height={60}
                    className={`thumbnail ${mainImg === url ? 'active' : ''}`}
                    src={url}
                    onClick={() => setMainImg(url)}
                    preview={false}
                  />
                ))}
              </div>
            </div>

            {/* 상세 정보 */}
            <Divider />
            <div className="item-title">{item.bookName || item.title}</div>
            <div className="item-explain">{item.bookDetail || item.explain}</div>
            <div>장르 : {item.genreName}</div>
            <div>출판사 : {item.publisher}</div>
            <div>가격: {item.price?.toLocaleString()}원</div>
            <div>할인율: {item.discount}%</div>
            <div>재고: {item.stock}개</div>

            {/* 버튼들 */}
              <div className="item-buttons">
                <Button icon={<EditOutlined />} type="primary" onClick={() => handleEdit(item.no)}>
                  수정하기
                </Button>
                <Button danger onClick={() => handleDelete(item.no)}>
                  삭제하기
                </Button>
              </div>
            </div>
        )}
      </Content>
      <Footer style={{ textAlign: 'center' }}>서적마켓 ©2025</Footer>
    </Layout>
  );
}
