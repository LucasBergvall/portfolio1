import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BoardWritePage.css';

export default function BoardWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState([]); // ✅ 여러 개로 변경
  const [previewUrls, setPreviewUrls] = useState([]); // ✅ 미리보기 배열

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    alert(`게시글 "${title}"이 등록되었습니다.`);
    console.log('제목:', title);
    console.log('내용:', content);
    console.log('이미지 목록:', imageFiles);

    // 서버 전송 예시 (주석 해제 시 작동)
    /*
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    imageFiles.forEach(file => {
      formData.append('images', file); // key 이름은 서버와 맞춰야 함
    });

    fetch('/api/posts', {
      method: 'POST',
      body: formData,
    });
    */

    navigate('/board');
  };

  return (
    <div className="write-container">
      <h2 className="write-title">✍️ 게시글 작성</h2>
      <form className="write-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        <input
          type="file"
          accept="image/*"
          multiple // ✅ 여러 이미지 선택 가능
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
