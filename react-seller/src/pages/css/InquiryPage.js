import React, { useEffect, useState, useRef } from 'react';
import { Card, List, Button, Layout } from 'antd';
import './css/InquiryPage.css'; // ✅ 바뀐 CSS 적용
import axios from 'axios';
import { useSelector } from 'react-redux';
import InquiryChat from '../css/InquiryChat';
import mqtt from 'mqtt';

export default function InquiryPage() {
  const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const cnt = 20;
	const pagesPerGroup = 5;
	const currentGroup = Math.ceil(page / pagesPerGroup);
	const startPage = (currentGroup - 1) * pagesPerGroup + 1;
	const endPage = Math.min(currentGroup * pagesPerGroup, totalPages);

  const [orderList, setOrderList] = useState([]);
  const { token } = useSelector((state) => state.LoginReducer);
  const [chatItem, setChatItem] = useState(null);
  const [mqttClient, setMqttClient] = useState(null);

  const orderNoRef = useRef(0);


  // MQTT 연결
  useEffect(() => {
    const client = mqtt.connect('ws://175.126.37.21:11884', {
      clean: true,
      reconnectPeriod: 2000,
      clientId: 'chat_' + new Date().getTime(),
      username: 'aaa',
      password: 'bbb'
    });

    client.on('message', (topic, payload) => {
      const msg = JSON.parse(payload.toString());
      const no = Number(Number(topic.split("/").pop()))
      console.log(topic);
      console.log("받은 메시지 : " + msg);
      console.log("수신된 토픽 번호:", no)
      console.log("현재 열려있는 채팅 번호: ", orderNoRef.current);

      if(no !== orderNoRef.current) {
        handleLoad(Number(topic.split("/").pop()));
      }
    });

    setMqttClient(client);
    return () => client.end();
  }, []);

  useEffect(() => {
   if (mqttClient) {
      mqttClient.on('connect', () => {
        console.log('MQTT 연결됨 후 selectOrderList 실행');
        selectOrderList(); // 연결되면 이후에 호출
      });
    }
  }, [mqttClient]);

  const selectOrderList = async () => {
    const url = `/api2/sorder/selectlist?page=${page}&cnt=${cnt}`;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const { data } = await axios.get(url, { headers });
      console.log(data);

      if (data.status === 1) {
       

        const topics = data.list
          .filter(item => item.paymentHistoryActionNo !== null) // null 아닌 것만
          .map(item => `chat/order/${item.no}`);
        console.log(topics);
  
        console.log('MQTT 연결됨 (chat)');
        mqttClient.subscribe(topics, (error1) => {
          if (error1) console.error('구독 실패', error1);
          else console.log('구독 성공');
        });

        setOrderList(data.list);
        const totalCount = data.totalCount || 0;
				const pages = Math.ceil(totalCount / cnt);
				setTotalPages(pages > 0 ? pages : 1);
      } else {
        alert("판매 목록 조회 실패: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("서버오류");
    }
  };

  const handleClick = async(item) => {
    console.log(item);
    const url = `/api2/message/change-sellerread?phaNo=${item.paymentHistoryActionNo}`;
    const headers = { Authorization: `Bearer ${token}` };
    const {data} = await axios.put(url, {} ,{headers});
    console.log(data);
    setChatItem(item);

    orderNoRef.current = item.no;

    setOrderList((prevList) => 
      prevList.map((item) => {
        if(item.no === orderNoRef.current) {
          return{...item, count: 0};
        }
        return item;
      })
    );
  };

  const handleClose = async () => {
		setChatItem(null);
		orderNoRef.current = 0;
	};

  const handleLoad = async(orderNo) => {
    console.log(orderNo);

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const {data} = await axios.get(`/api2/message/count-unread?orderNo=${orderNo}`, {headers});
      console.log(data);
      
      setOrderList((prevList) =>
        prevList.map((item) => {
          if(item.no === orderNo) {
            return { ...item, count: data.count };
          }
          return item;
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout className='inquiry-container'>
      <div className="inquiry">
        <h2>문의 내역</h2>
        <Card>
          <List
            itemLayout="horizontal"
            dataSource={orderList.filter(item => item.paymentHistoryActionNo !== null)} // 조건 필터
            renderItem={(item) => (
              <List.Item
                actions={[
                    <Button className="inquiry-btn" onClick={() => handleClick(item)}>
                      1대1 문의
                    </Button>,
                   item.count != null && <span key="count" style={{ color: 'red', fontWeight: 'bold' }}>({item.count}건)</span>
                ]}
              >
                <List.Item.Meta
                  title={item.item.title}
                  description={`판매일: ${item.regdate} | 가격: ${item.item.bookprice}원 | 수량: ${item.quantity} | 구매자: ${item.member.nickname}`}
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '12px', color: 'gray' }}>
                    {item.review?.review || '리뷰 없음'}
                  </span>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </div>

      {/* 페이징 */}
      <div className="pagination">
				{startPage > 1 && (
					<>
						<button onClick={() => setPage(1)}>&laquo;</button>
						<button onClick={() => setPage(startPage - 1)}>&lt;</button>
					</>
				)}

				{Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
					const pageNumber = startPage + idx;
					return (
						<button
							key={pageNumber}
							onClick={() => setPage(pageNumber)}
							className={page === pageNumber ? "active" : ""}
						>
							{pageNumber}
						</button>
					);
				})}

				{endPage < totalPages && (
					<>
						<button onClick={() => setPage(endPage + 1)}>&gt;</button>
						<button onClick={() => setPage(totalPages)}>&raquo;</button>
					</>
				)}
			</div>

      {chatItem && (
          <InquiryChat
            orderNo={chatItem.no}
            visible={!!chatItem}
            onClose={() => handleClose()}
            item={chatItem}
          />
      )}

    </Layout>
  );
} 