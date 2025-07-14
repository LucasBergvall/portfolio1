// npm i mqtt

import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';


const Mqtt = () => {
    const [message, setMessage] = useState('');
    const [mqttClient, setMqttClient] = useState(null);

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
            console.log('수신된 메시지:', payload.toString());
            setMessage(payload.toString());
        });

        // MQTT 클라이언트 설정
        setMqttClient(client);

        // 컴포넌트가 언마운트될 때 클라이언트 연결 종료
        return () => {
            client.end();
        };
    }, []);

    const sendMessage = () => {
        if (mqttClient) {
            // 'test/topic'에 메시지 전송
            mqttClient.publish('test/topic', '안녕하세요'+ new Date());
            console.log('메시지 전송: Hello from React!');
        }
    };

    return (
        <div>
            <h1>MQTT 클라이언트</h1>
            <p>수신된 메시지: {message}</p>
            <button onClick={sendMessage}>메시지 전송</button>
        </div>
    );
};

export default Mqtt;