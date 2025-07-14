import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NoticeWritePage.css';

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

    alert(`공지사항 "${title}"이 등록되었습니다.`);
    console.log('제목:', title);
    console.log('내용:', content);
    navigate('/notice');
  };

  return (
    <div className="write-container">
      <h2 className="write-title">✍️ 공지사항 작성</h2>
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
          <button type="button" className="cancel-button" onClick={() => navigate('/notice')}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
