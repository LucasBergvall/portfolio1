// src/pages/ItemRegisterPage.js
import React, { useEffect, useState } from 'react';
import { Card, List, Button, Menu, Layout, message, Modal, Col, Row, Pagination } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, FileTextOutlined, ShoppingCartOutlined, CloudUploadOutlined, FileSearchOutlined, CloudServerOutlined } from '@ant-design/icons';
import './css/ItemRegisterPage.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

export default function ItemRegisterPage() {
  // 1. 변수
  const { Sider } = Layout;
  const navigate = useNavigate();
  const [itemList, setItemList] = useState([]);
  const [page, setPage] = useState(1);
  const [cnt, setCnt] = useState(20);
  const [text, setText] = useState("");
  const { token } = useSelector((state) => state.LoginReducer);
  const [total, setTotal] = useState(100);
  const dispatch = useDispatch();

  // 2. 이펙트
  useEffect(() => {
    selectlist();
  }, [page]);

  // 3. 함수
  const setPagination = (page , pageSize) => {
    setPage(page)
    console.log(page);
  }


  const selectlist = async() => {
   try {
      const url = `/api2/item/selectlist?page=${page}&cnt=${cnt}&text=${text}`;
      const headers = { Authorization: `Bearer ${token}` }
      const {data} = await axios.get(url, { headers });
      console.log(data)

      if (data.status === 1) {
          setItemList(data.list);
          setTotal(data.total);
      } else {
          console.error('상품 목록 로드 실패', data.message);
      }
    } catch (err) {
      console.error('서버 에러', err);
    }
  }


  // 4. html렌더링
  return (
    <Layout className="item-register-container">
      <div className="item-register-page">
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col><h2>등록한 상품</h2></Col>
          <Col>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                dispatch({type: 'item_menu', idx : "2"});
                navigate('/item/insert')}}
            >
              새 상품 등록하기
            </Button>
          </Col>
        </Row>
        <Card>
          <List
            itemLayout="horizontal"
            dataSource={itemList}
            renderItem={item => (
              <List.Item
                actions={[
                  <Button type="link" key="edit" onClick={() => navigate(`/item/update?no=${item.no}`)}>수정</Button>,
                  <Button type="link" danger key="delete" onClick={() => navigate(`/item/delete?no=${item.no}`)}>삭제</Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    item.default_img_url && (
                      <img
                        src={item.default_img_url}
                        alt="썸네일"
                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                      />
                    )
                  }
                  title={item.title}
                  description={`등록일: ${item.regdate || '날짜 없음'} | 가격: ${item.bookprice?.toLocaleString() || 0}원`}
                />
              </List.Item>
            )}
          />
        </Card>
        {/* Pagination 영역 */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Pagination
            current={page}
            pageSize={cnt}
            total={total}
            onChange={setPagination}
          />
        </div>
      </div>
    </Layout>
  );
}
