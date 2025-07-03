import React, { useEffect, useState, useRef } from 'react';
import { Input, Button, List, Avatar, Typography, Image, Upload, } from 'antd';
import { SendOutlined, UserOutlined, UploadOutlined, CloseOutlined, AudioOutlined } from '@ant-design/icons';
import './css/Chat.css';
import ChatbotIcon from '../../assets/chat_imote.png';
import axios from 'axios';

const { Text } = Typography;

const Chat = () => {
  // 1. 변수
  const messagesListRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState([
      {
        id: 1,
        sender: 'bot',
        type: 'text',
        content: '안녕하세요! 이미지를 업로드하고 질문을 입력해 주세요 😊',
      },
    ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [fileList, setFileList] = useState([]);

  // 2. 이펙트
  useEffect(() => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 3. 함수
  const handleRemoveImage = (file) => {
    setFileList(fileList.filter(f => f.uid !== file.uid));
  };

  const handleUpload = ({ fileList: newFileList }) => {
    setFileList(newFileList); // 하나만 유지
    return false;
  };

  const handleSend = async (menu) => {
    // if() {

    // }

  }

  // 텍스트만 보내기
  const handleTextSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      type: 'text',
      content: text,
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const body = { "question": text };
      const { data } = await axios.post('/api3/chat', body);
      console.log(data);
      const result = data.answer || data.결과 || '응답이 없습니다.';
      const messageType = typeof result === 'string' ? 'text' : Array.isArray(result) ? 'list' : 'object';

      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', type: messageType, content: result }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', type: 'text', content: '❌ 서버 응답 실패' }]);
    }

    setInput('');
    setIsSending(false);
  };

  // 이미지 전송
  const handleImageSend = async () => {
    if (fileList.length === 0 || isSending) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      type: 'group',
      content: {
        text: '', // 이미지 전송 시 텍스트는 공백
        images: fileList.map(file => file.thumbUrl || URL.createObjectURL(file.originFileObj)),
      },
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // 이미지 업로드 전송은 보통 FormData 사용 (예시)
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('image', file.originFileObj);
      });

      const { data } = await axios.post('/api3/image-search', formData);
      console.log(data);
      const result = data.answer || data.결과 || '응답이 없습니다.';
      const messageType = typeof result === 'string' ? 'text' : Array.isArray(result) ? 'list' : 'object';

      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', type: messageType, content: result }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', type: 'text', content: '❌ 서버 응답 실패' }]);
    }

    setFileList([]);
    setIsSending(false);
  };

  // 브라우저의 음성 녹음 및 파일 전송 처리
  const handleVoiceInput = async () => {
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('file', audioBlob, 'voice.webm');

        const { data } = await axios.post('/api3/voice-chat', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const transcribed = data.transcribed_text;
        const newMessage = { id: messages.length + 1, sender: 'user', text: transcribed };

        setMessages([
          ...messages,
          newMessage,
          {
            id: messages.length + 2,
            sender: 'bot',
            text: data.response,
          },
        ]);
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 6000); // 6초간 녹음
    } catch (err) {
      console.error("🎙 음성 녹음 실패:", err);
      }
  };

  return (
    <>
      {/* 챗봇 버튼 */}
      <div
        onClick={() => setVisible(!visible)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          zIndex: 1100,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src={ChatbotIcon} alt="챗봇 아이콘" style={{ width: '32px', height: '32px' }} />
      </div>

      {/* 챗봇 창 */}
      {visible && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          width: '400px',
          height: '600px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          backgroundColor: '#fff',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div className="chat-header">
            <Text style={{ color: '#fff', fontSize: '20px' }}>챗봇 상담</Text>
          </div>
          <div className="chat-content">
            <List
              dataSource={messages}
              renderItem={(item) => (
                <List.Item className={item.sender === 'user' ? 'chat-user' : 'chat-bot'}>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={item.sender === 'user' ? '나' : '챗봇'}
                    description={
                      item.type === 'image' ? (
                        <Image
                          src={item.content}
                          alt="챗 이미지"
                          style={{ maxWidth: '200px', borderRadius: '8px' }}
                        />
                      ) : item.type === 'group' ? (
                        <>
                          <p>{item.content.text}</p>
                          {item.content.images.map((img, idx) => (
                            <Image
                              key={idx}
                              src={img}
                              alt={`uploaded-${idx}`}
                              style={{ maxWidth: '200px', borderRadius: '8px', marginTop: '4px' }}
                            />
                          ))}
                        </>
                      ) : (
                        typeof item.content === 'object' ? (
                          <pre>{JSON.stringify(item.content, null, 2)}</pre>
                        ) : (
                          item.content
                        )
                      )
                    }
                  />
                </List.Item>
              )}
            />
            <div ref={messagesListRef} />
          </div>

          {/* ✅ 미리보기 줄 */}
          {fileList.length > 0 && (
            <div className="preview-bar">
              {fileList.map(file => (
                <div key={file.uid} className="preview-image">
                  <img src={file.thumbUrl || URL.createObjectURL(file.originFileObj)} alt="preview" />
                  <CloseOutlined onClick={() => handleRemoveImage(file)} />
                </div>
              ))}
            </div>
          )}
          <div className="chat-footer">
            <div className="chat-input-area">
              <Upload
                fileList={fileList}
                beforeUpload={() => false}
                onChange={handleUpload}
                accept="image/*"
                showUploadList={false}
                multiple
              >
                <Button icon={<UploadOutlined />} style={{ height: '40px', marginLeft: '4px' }} />
              </Upload>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPressEnter={handleImageSend}
                placeholder="질문을 입력하세요"
                style={{ height: '40px', flexGrow: 1 }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleTextSend}
                style={{ height: '40px', marginLeft: '4px' }}
              />
              <Button
                type="default"
                icon={<AudioOutlined />}
                onClick={handleVoiceInput}
                style={{ height: '40px' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
