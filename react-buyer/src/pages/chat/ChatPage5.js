import React, { useEffect, useRef, useState } from 'react';
import {
  Input,
  Button,
  List,
  Avatar,
  Typography,
  Image,
  Upload,
  message as AntMessage,
} from 'antd';
import { 
  SendOutlined, 
  UserOutlined, 
  UploadOutlined, 
  CloseOutlined,
 } from '@ant-design/icons';
import axios from 'axios';
import './css/ChatPage5.css';

const { Text } = Typography;

const ChatPage = () => {
  // 1. 변수
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      type: 'text',
      content: '안녕하세요! 이미지를 업로드하고 질문을 입력해 주세요 😊',
    },
  ]);
  const [input, setInput] = useState('');
  const [fileList, setFileList] = useState([]);
  const [isSending, setIsSending] = useState(false);


  // 2. 이펙트

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);


  // 3. 함수
  const handleUpload = ({ fileList: newFileList }) => {
    setFileList(newFileList); // 하나만 유지
    return false;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      type: 'group',
      content: {
        text,
        images: fileList.map(file => file.thumbUrl || URL.createObjectURL(file.originFileObj)),
      },
    };
      setMessages(prev => [...prev, userMessage]);
    /*
    if (fileList.length === 0 || !fileList[0].originFileObj) {
      AntMessage.warning('이미지를 먼저 업로드해 주세요!');
      return;
    }

    setIsSending(true);

   

    const formData = new FormData();
    formData.append('question', text);
    fileList.forEach(file => {
      formData.append('images', file.originFileObj);
    });
    */
    try {
      const body = {"question" : text};
      const { data } = await axios.post('/api3/chat', body);
      console.log(data);
      const result = data.answer || data.결과 || '응답이 없습니다.';
      const messageType = typeof result === 'string' ? 'text' : Array.isArray(result) ? 'list' : 'object';

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          type: messageType,
          content: result,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          type: 'text',
          content: '❌ 서버 응답 실패',
        },
      ]);
    }

    setInput('');
    setFileList([]);
    setIsSending(false);
  };

  const handleRemoveImage = (file) => {
    setFileList(fileList.filter(f => f.uid !== file.uid));
  };

  const renderContent = (item) => {
    const { type, content } = item;

    if (type === 'group') {
      return (
        <>
          <p>{content.text}</p>
          {content.images.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`uploaded-${idx}`}
              style={{ maxWidth: '200px', borderRadius: '8px' }}
            />
          ))}
        </>
      );
    }

    if (typeof content === 'string') return content;

    if (Array.isArray(content)) {
      return (
        <div>
          {content.map((entry, idx) => (
            <div key={idx} style={{ marginBottom: '8px' }}>
              <p><strong>📌 클래스:</strong> {entry.class}</p>
              <p><strong>📦 위치:</strong> {JSON.stringify(entry.bbox)}</p>
              {entry.matched_text && (
                <p><strong>📝 텍스트:</strong> {entry.matched_text.text}</p>
              )}
              <hr />
            </div>
          ))}
        </div>
      );
    }

    if (typeof content === 'object') {
      if (content.summary && typeof content.summary === 'object') {
        return (
          <div>
            <p><strong>🧾 도면 내 부품 요약:</strong></p>
            {Object.entries(content.summary).map(([category, items], idx) => (
              <div key={idx} style={{ marginBottom: '12px' }}>
                <strong>📂 {category}</strong>
                <ul style={{ margin: '4px 0 0 16px' }}>
                  {items.map((label, i) => (
                    <li key={i}>{label}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      }
      return <pre>{JSON.stringify(content, null, 2)}</pre>;
    }

    return '❓ 알 수 없는 응답 형식입니다.';
  };

  

  return (
    <div className="chat-page">
      <div className="chat-box">
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
                  description={renderContent(item)}
                />
              </List.Item>
            )}
          />
          <div ref={messagesEndRef} />
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
              onPressEnter={handleSend}
              placeholder="질문을 입력하세요"
              style={{ height: '40px', flexGrow: 1 }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              style={{ height: '40px', marginLeft: '4px' }}
              disabled={!input.trim() || isSending}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;