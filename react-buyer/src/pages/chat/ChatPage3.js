import React, { useEffect, useRef, useState } from 'react';
import {
  Input, Button, List, Avatar, Typography, Upload, Image, message as AntMessage,
} from 'antd';
import {
  SendOutlined, UserOutlined, UploadOutlined, CloseOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import './css/ChatPage3.css';

const { Text } = Typography;

const ChatPage = () => {
  // 1. 변수
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', type: 'text', content: '안녕하세요! 무엇을 도와드릴까요?' },
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
    setFileList(newFileList);
    return false;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text && fileList.length === 0) return;

    setIsSending(true);

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

    const handleSendImg = async() => {

    };
    setFileList(prev => [...prev, ])

    const formData = new FormData();
    if (text) formData.append('question', text);
    fileList.forEach(file => {
      formData.append('images', file.originFileObj);
    });

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
    if (item.type === 'group') {
      return (
        <div>
          {item.content.text && <p>{item.content.text}</p>}
          {item.content.images.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`uploaded-${idx}`}
              style={{ maxWidth: '200px', borderRadius: '8px', marginTop: '8px' }}
            />
          ))}
        </div>
      );
    }
    return item.content;
  };

 

  return (
    <div className='chat-area' 
        style={{position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '400px',
                height: '800px',
                zIndex: 9999,
    }}>
      <div className="chat-box">
        <div className="chat-header" style={{ backgroundColor: '#F7C600', color: '#000' }}>
          <Text style={{ fontSize: '20px' }}>챗봇 상담</Text>
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

        {fileList.length > 0 && (
          <div className="preview-area">
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
              <Button icon={<UploadOutlined />} style={{ height: '40px' }} />
            </Upload>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={handleSend}
              placeholder="메시지를 입력하세요"
              style={{ height: '40px', flexGrow: 1 }}
            />
            <Button
              className="chat-enter-btn"
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={isSending}
            />
          </div>
        </div>
      </div>
    </div>

  );
};

export default ChatPage;
