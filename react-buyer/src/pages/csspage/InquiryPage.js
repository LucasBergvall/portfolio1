// src/pages/InquiryPage.js
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import InquiryChat from "../csspage/InquiryChat";
import { Content } from "antd/es/layout/layout";
import { Row, Col } from "antd";
import mqtt from "mqtt";

import "./css/InquiryPage.css";
import CustomFooter from "../footer/CustomFooter";

export default function InquiryPage() {
	const { token } = useSelector((state) => state.LoginReducer);
	const [orderList, setOrderList] = useState([]);
	const [chatItem, setChatItem] = useState(null);
	
	const [mqttClient, setMqttClient] = useState(null);

	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const cnt = 20;
	const pagesPerGroup = 5;
	const currentGroup = Math.ceil(page / pagesPerGroup);
	const startPage = (currentGroup - 1) * pagesPerGroup + 1;
	const endPage = Math.min(currentGroup * pagesPerGroup, totalPages);
	

	const orderNoRef = useRef(0);

	useEffect(() => {
		const client = mqtt.connect("ws://175.126.37.21:11884", {
			clean: true,
			reconnectPeriod: 2000,
			clientId: "chat_" + new Date().getTime(),
			username: "aaa",
			password: "bbb",
		});

		client.on("message", (topic, payload) => {
			const msg = JSON.parse(payload.toString());
			const no = Number(topic.split("/").pop());
			console.log(topic);
			console.log(msg);
			console.log("no => ", no);
			console.log("orderNo1 => ", orderNoRef.current);

			if (no !== orderNoRef.current) {
				handleLoad(no);
			}
		});

		setMqttClient(client);
		return () => client.end();
	}, []);


	useEffect(() => {
		if (mqttClient && mqttClient.connected) {
			if (token) {
				fetchOrderList(); // 연결된 상태에서만 실행
			}
		} else if (mqttClient) {
			mqttClient.on("connect", () => {
				console.log("MQTT 연결됨 후 selectOrderList 실행");
				fetchOrderList(); // 연결되면 이후에 호출
			});
		}
	}, [mqttClient, page, token]);


	const fetchOrderList = async () => {
		try {
			const headers = { Authorization: `Bearer ${token}` };
			const res = await axios.get(`/api2/buyorder/selectlist?page=${page}&cnt=${cnt}`, { headers });

			if (res.data.status === 1) {
				const topics = res.data.list.filter((item) => item.paymentHistoryActionNo !== null) // null 아닌 것만
					.map((item) => `chat/order/${item.no}`);
				console.log(topics);

				mqttClient.subscribe(topics, (error1) => {
					if (error1)
						console.error("구독 실패", error1);
					else
						console.log("구독 성공");
				});

				setOrderList(res.data.list);
				const totalCount = res.data.totalCount || 0;
				const pages = Math.ceil(totalCount / cnt);
				setTotalPages(pages > 0 ? pages : 1);
			} else {
				alert("주문 목록 조회 실패: " + res.data.message);
			}
		} catch (err) {
			console.error("에러 발생:", err);
			alert("서버 오류");
		}
	};


	const handleClick = async (item) => {
		console.log(item);
		const url = `/api2/message/change-buyerread?phaNo=${item.paymentHistoryActionNo}`;
		const headers = { Authorization: `Bearer ${token}` };
		const { data } = await axios.put(url, {}, { headers });
		console.log(data);
		setChatItem(item);

		orderNoRef.current = item.no;

		setOrderList((prevList) =>
			prevList.map((item) => {
				if (item.no === orderNoRef.current) {
					return { ...item, count: 0 };
				}
				return item;
			})
		);
	};


	const handleClose = async () => {
		setChatItem(null);
		orderNoRef.current = 0;
	};


	const handleLoad = async (orderNo) => {
		try {
			const headers = { Authorization: `Bearer ${token}` };
			const { data } = await axios.get(`/api2/message/count-buyer-unread?orderNo=${orderNo}`, { headers });
			console.log(data);

			setOrderList((prevList) =>
				prevList.map((item) => {
					if (item.no === orderNo) {
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
		<Content className="border-content">
			<h2 className="border-title">📬 문의 가능한 상품 목록</h2>

			<Row gutter={[16, 24]} justify="start">
				{orderList.length === 0 ? (
					<div style={{ textAlign: "center", padding: "50px", fontSize: "20px" }}>
						문의 가능한 상품이 없습니다.
					</div>
				) : (
					orderList
						.filter((item) => item.paymentHistoryActionNo !== null)
						.map((item) => {
							const title = item.item?.title ?? "제목없음";
							const bookprice = item.item?.bookprice ?? 0;
							const discount = item.item?.itemBook?.discount ?? 0;
							const quantity = item.quantity ?? 1;
							const imgUrl = item.item?.default_img_url ?? "/default-image.png";
							const totalPrice = Math.floor(
								(bookprice - bookprice * (discount / 100)) * quantity
							);

							return (
								<Col key={item.no} xs={24} sm={12} md={8} lg={6}>
									<div className="border-card">
										<div className="border-image-wrapper">
											<img src={imgUrl} alt={title} className="border-image" />
										</div>
										<div className="border-info">
											<h3 className="border-book-title">{title}</h3>
											<div className="border-final-price">
												수량: {quantity}개
											</div>
											<div className="border-final-price">
												총 결제금액: {totalPrice.toLocaleString()}원
											</div>
											<button className="border-button" onClick={() => handleClick(item)}	>
												1대1 문의
											</button>
											{item.count !== null && item.count !== undefined && (
												<span key="count" style={{ color: "red", fontWeight: "bold" }}	>
													{" "}({item.count}건){" "}
												</span>
											)}
										</div>
									</div>
								</Col>
							);
						})
				)}
			</Row>

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

			{/* 채팅 모달 */}
			{chatItem && (
				<InquiryChat
					orderNo={chatItem.no}
					visible={!!chatItem}
					onClose={() => handleClose()}
					item={chatItem}
				/>
			)}

			<CustomFooter />
		</Content>
	);
}