import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/BoardWritePage.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function BoardWritePage() {
  
  // 1. 변수
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.LoginReducer);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  console.log(imageFiles);
  
  // 3. 함수
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  
  const onFinish = async (e) => {
    e.preventDefault();

    if (!title.trim() || !text.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const formData = new FormData();
      const boardInsert = { title, text };

      formData.append("board", new Blob([JSON.stringify(boardInsert)], { type: "application/json" }));
      imageFiles.forEach((file) => {
        formData.append("img", file);
      });

      const url = `/api2/board/insert`;
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const { data } = await axios.post(url, formData, { headers });

      if (data.status === 1) {
        alert(`게시글 "${title}"이 등록되었습니다.`);
        navigate('/board');
      } else {
        alert('등록 실패: ' + data.message);
      }

    } catch (error) {
      console.error('게시글 등록 오류:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  // 4. 렌더링
  return (
    <div className="write-container">
      <h2 className="write-title">✍️ 게시글 작성</h2>
      <form className="write-form" onSubmit={onFinish}>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="내용을 입력하세요"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="image-input"
        />

        {previewUrls.length > 0 && (
          <div className="image-preview">
            {previewUrls.map((url, idx) => (
              <img key={idx} src={url} alt={`미리보기 ${idx + 1}`} />
            ))}
          </div>
        )}

        <div className="write-buttons">
          <button type="submit" className="submit-button">작성하기</button>
          <button type="button" className="cancel-button" onClick={() => navigate('/board')}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
