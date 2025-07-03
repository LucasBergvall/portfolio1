import React, { useEffect, useRef, useState } from 'react';
import {
  Input,
  Button,
  List,
  Avatar,
  Typography,
  Image,
  Upload,
  Space
} from 'antd';
import {
  SendOutlined,
  UserOutlined,
  UploadOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import './css/ChatPage.css';
import axios from 'axios';

const { Text } = Typography;

const ChatPage = () => {
  const messagesListRef = useRef(null);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      type: 'text', 
      content: '안녕하세요! 무엇을 도와드릴까요?' },
  ]);
  const [input, setInput] = useState('');
  const [fileList, setFileList] = useState([]);

  const handleSend = async () => {
    if (!input.trim() && fileList.length === 0) return;

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      type: 'group',
      content: {
        text: input.trim(),
        images: fileList.map(file => file.thumbUrl || URL.createObjectURL(file.originFileObj)),
      },
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const { data } = await axios.post('/api1/chat', { question: input });
      const botResponse = Array.isArray(data.response)
        ? data.response.map((item, idx) => ({
            id: messages.length + 2 + idx,
            sender: 'bot',
            type: item.type,
            content: item.content,
          }))
        : [{
            id: messages.length + 2,
            sender: 'bot',
            type: 'text',
            content: data.response,
          }];
      setMessages(prev => [...prev, ...botResponse]);
    } catch (err) {
      console.error(err);
    }

    setInput('');
    setFileList([]);
  };

  const handleUploadChange = ({ fileList: newList }) => {
    setFileList(newList);
  };

  const handleRemoveImage = (file) => {
    setFileList(fileList.filter(f => f.uid !== file.uid));
  };

  const renderItem = (item) => {
    if (item.type === 'group') {
      return (
        <List.Item className={item.sender === 'user' ? 'chat-user' : 'chat-bot'}>
          <List.Item.Meta
            avatar={<Avatar icon={<UserOutlined />} />}
            title={item.sender === 'user' ? '나' : '챗봇'}
            description={
              <>
                {item.content.text && <p>{item.content.text}</p>}
                <Space wrap>
                  {item.content.images.map((img, idx) => (
                    <Image key={idx} src={img} width={100} />
                  ))}
                </Space>
              </>
            }
          />
        </List.Item>
      );
    }

    return (
      <List.Item className={item.sender === 'user' ? 'chat-user' : 'chat-bot'}>
        <List.Item.Meta
          avatar={<Avatar icon={<UserOutlined />} />}
          title={item.sender === 'user' ? '나' : '챗봇'}
          description={
            item.type === 'image' ? (
              <Image src={item.content} alt="img" style={{ maxWidth: '200px', borderRadius: '8px' }} />
            ) : (
              item.content
            )
          }
        />
      </List.Item>
    );
  };

  useEffect(() => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-page">
      <div className="chat-box">
        <div className="chat-header">챗봇 상담</div>

        <div className="chat-body">
          <List dataSource={messages} renderItem={renderItem} />
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

        {/* ✅ 입력창 */}
        <div className="chat-footer">
          <Upload
            multiple
            accept="image/*"
            showUploadList={false}
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />} />
          </Upload>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={(e) => {
              e.preventDefault();
              handleSend();
            }}
            placeholder="메시지를 입력하세요"
            style={{ flexGrow: 1 }}
          />
          <Button type="primary" icon={<SendOutlined />} onClick={handleSend} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
