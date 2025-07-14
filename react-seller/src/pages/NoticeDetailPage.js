import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './NoticeDetailPage.css';

const today = new Date('2025-05-30');
const allPosts = Array.from({ length: 220 }, (_, idx) => {
  const postDate = new Date(today);
  postDate.setDate(postDate.getDate() - idx);
  const formattedDate = postDate.toISOString().slice(0, 10);
  return {
    id: idx + 1,
    title: `공지사항 제목 ${idx + 1}`,
    date: formattedDate,
    views: Math.floor(Math.random() * 100),
  };
});

export default function BoardDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const post = allPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="detail-container">
        <p>해당 게시글을 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/notice')}>공지사항으로</button>
      </div>
    );
  }

 const handleEdit = () => {
    navigate(`/notice-edit/${post.id}`);
 };

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      alert('삭제되었습니다 (모의 기능).');
      navigate('/notice');
    }
  };

  return (
    <div className="detail-container">
      <h2 className="detail-title">{post.title}</h2>
      <div className="detail-meta">
        <span>날짜: {post.date}</span>
        <span>조회수: {post.views}</span>
      </div>
      <div className="detail-content">
        이곳에 게시글 내용을 출력합니다.  
        (현재 예제에서는 본문이 없으므로 고정 텍스트입니다.)
      </div>
      <div className="detail-buttons">
        <button onClick={() => navigate('/notice')}>목록</button>
        <button onClick={handleEdit}>수정</button>
        <button onClick={handleDelete}>삭제</button>
      </div>
    </div>
  );
}
