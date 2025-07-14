import './BoardPage.css';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

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
  };
});

const postsPerPage = 10;
const pagesPerGroup = 10;

export default function Board() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(currentGroup * pagesPerGroup, totalPages);

  return (
    <div className="board-container">
      <div className="board-header">
        <h2 className="board-title">📋 게시판</h2>
        <button className="write-button" onClick={() => navigate('/board-write')}>
          글쓰기
        </button>
      </div>

      <table className="board-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>썸네일</th> {/* ✅ 썸네일 컬럼 추가 */}
            <th>제목</th>
            <th>작성자</th>
            <th>날짜</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post, index) => (
            <tr key={post.id}>
              <td>{allPosts.length - (indexOfFirstPost + index)}</td>
              <td>
                <img
                  src={post.image}
                  alt="썸네일"
                  className="thumbnail-img"
                  onError={(e) => (e.target.src = '/default-thumbnail.jpg')}
                />
              </td>
              <td
                className="board-post-title"
                onClick={() => navigate(`/board-detail/${post.id}`)}
              >
                {post.title}
              </td>
              <td>{post.author}</td>
              <td>{post.date}</td>
              <td>{post.views}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {startPage > 1 && (
          <button className="nav-button" onClick={() => setCurrentPage(startPage - 1)}>
            &lt;
          </button>
        )}
        {Array.from({ length: endPage - startPage + 1 }, (_, idx) => (
          <button
            key={startPage + idx}
            onClick={() => setCurrentPage(startPage + idx)}
            className={currentPage === startPage + idx ? 'active' : ''}
          >
            {startPage + idx}
          </button>
        ))}
        {endPage < totalPages && (
          <button className="nav-button" onClick={() => setCurrentPage(endPage + 1)}>
            &gt;
          </button>
        )}
      </div>
    </div>
  );
}
