import React, { useEffect, useState } from 'react';
import { Card, List, Button, Rate, Layout, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './css/SaleHistory.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function SaleHistory() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [cnt, setCnt] = useState(20);
  const { token } = useSelector((state) => state.LoginReducer);
  const [list, setList] = useState([]);

  useEffect(() => {
    selectOrderList();
  }, [page]);

  const selectOrderList = async () => {
    console.log("AA")
    const url = `/api2/sorder/selectlist?page=${page}&cnt=${cnt}`;
    const headers = { Authorization: `Bearer ${token}` };
    const { data } = await axios.get(url, { headers });
    console.log(data);
    if (data.status === 1) {
      
      setList(data.list);
    }
  };

  return (
    <Layout className='salehistory-container'>
      <div className="sale-history">
        <h2>판매 내역</h2>
        <Card>
          <List
            itemLayout="horizontal"
            dataSource={list}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.item.title}
                  description={`판매일: ${item.regdate} | 가격: ${item.item.bookprice}원 | 수량: ${item.quantity} | 구매자: ${item.member.nickname}`}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Rate disabled value={item.review?.evaluation || 0} />
                  <span style={{ fontSize: '12px', color: 'gray' }}>{item.review?.review || '리뷰 없음'}</span>
                </div>
              </List.Item>
            )}
          />
        </Card>

        <Button
          block
          className="salehistory-btn"
          style={{ marginTop: 16 }}
          disabled={list.length === 0}
          onClick={() => {
            console.log("navigate로 넘기는 데이터", list);
            navigate('/sale/rating', { state: { reviews: list } });
          }}
        >
          나의 평점 페이지로 이동
        </Button>
      </div>
    </Layout>
  );
}
