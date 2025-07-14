import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './BoardEditPage.css'; // 스타일 재사용

// 가짜 데이터 (실제로는 백엔드에서 받아옴)
const today = new Date('2025-05-30');
const allPosts = Array.from({ length: 220 }, (_, idx) => {
  const postDate = new Date(today);
  postDate.setDate(postDate.getDate() - idx);
  const formattedDate = postDate.toISOString().slice(0, 10);
  return {
    id: idx + 1,
    title: `게시글 제목 ${idx + 1}`,
    author: `작성자 ${idx + 1}`,
    date: formattedDate,
    views: Math.floor(Math.random() * 100),
    content: `기존 게시글 ${idx + 1}의 내용입니다.`,
  };
});

export default function BoardEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = allPosts.find((p) => p.id === parseInt(id));

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFiles, setImageFiles] = useState([]); // ✅ 여러 개로 변경
  const [previewUrls, setPreviewUrls] = useState([]); // ✅ 미리보기 배열
  
    useEffect(() => {
      if (post) {
        setTitle(post.title);
        setContent(post.content);
      }
    }, [post]);
  
    const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      setImageFiles(files);
  
      const previews = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls(previews);
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!title.trim() || !content.trim()) {
        alert('제목과 내용을 입력하세요.');
        return;
      }

    alert(`"${title}" 수정이 완료되었습니다.`);
    console.log('수정된 제목:', title);
    console.log('수정된 내용:', content);
    navigate('/board');
  };

  if (!post) {
    return (
      <div className="write-container">
        <p>해당 게시글을 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/board')}>목록</button>
      </div>
    );
  }

  return (
    <div className="write-container">
      <h2 className="write-title">📝 게시글 수정</h2>
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
          <button type="submit" className="submit-button">수정하기</button>
          <button type="button" className="cancel-button" onClick={() => navigate('/board')}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
