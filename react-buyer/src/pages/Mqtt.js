// npm i mqtt

import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import { useSelector } from 'react-redux';
import axios from 'axios'; // 상단에 추가
import { message as antdMessage } from 'antd'; // 충돌 방지용 별칭


const Mqtt = ({orderNo}) => {
    // 1. 변수
    const [mqttClient, setMqttClient] = useState(null);
    const [inputText, setInputText] = useState('');
    const [receivedMsg, setReceivedMsg] = useState('');
    const { token } = useSelector(state => state.LoginReducer);

    // 2. 이펙트
    useEffect(() => {

        // MQTT 브로커 URL (WebSocket을 사용하고 인증 정보도 추가)
        const brokerUrl = `ws://175.126.37.21:11884`;

        const options = {
            clean: true, //세션 초기화
            reconnectPeriod: 2000, //주기적인 접속 유지 시간(ping) 2000는 2초에 해당함.
            clientId: 'id200_' + new Date().getTime(), // 클라이언트 아이디, 고유해야함.
            username: 'aaa', // broker접속 아이디
            password: 'bbb' // broker접속 암호
        };

        // MQTT 클라이언트 연결
        const client = mqtt.connect(brokerUrl, options);


        // MQTT 클라이언트 연결
        client.on('connect', () => {
            console.log('MQTT 클라이언트 연결됨');
            // 'test/topic'을 구독
            client.subscribe('test/topic', (err) => {
                if (err) {
                    console.error('구독 실패', err);
                } else {
                    console.log('구독 성공');
                }
            });
        });

        // 메시지 수신 이벤트
        client.on('message', (topic, payload) => {
            const msg = payload.toString();
            console.log('수신된 메시지:', msg);
            setReceivedMsg(msg);
        });

        // MQTT 클라이언트 설정
        setMqttClient(client);

        // 컴포넌트가 언마운트될 때 클라이언트 연결 종료
        return () => {
            client.end();
        };
    }, []);

    // 3. 함수
     const sendMessage = async () => {
        if (!inputText.trim()) {
            return antdMessage.warning("메시지를 입력하세요.");
        }
        if (!orderNo) {
            return antdMessage.warning("유효한 주문번호가 없습니다.");
        }

        if (mqttClient) {
            mqttClient.publish('test/topic', inputText);
            console.log('MQTT 메시지 전송:', inputText);

            try {
                const headers = { Authorization: `Bearer ${token}` };
                const body = { orderNo, content: inputText };
                const { data } = await axios.post(`/api2/message/send-by-order`, body, { headers });
                console.log(data);
                if (data.status === 1) {
                    antdMessage.success("메시지 전송 성공");
                    setInputText('');
                } else {
                    antdMessage.warning("메시지 저장 실패: " + data.message);
                }
            } catch (error) {
                console.error('axios 오류', error);
                antdMessage.error("서버 오류 발생");
            }
        }
    };

    return (
        <div>
            <h1>MQTT 클라이언트</h1>
            <p>수신된 메시지: {receivedMsg}</p>
            <button onClick={sendMessage}>메시지 전송</button>
        </div>
    );
};

export default Mqtt;