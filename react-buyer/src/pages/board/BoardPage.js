import './css/BoardPage.css';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function Board() {

  // 1. 변수
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.LoginReducer);

  const [postList, setPostList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const pagesPerGroup = 10;

  const totalPages = Math.ceil(postList.length / postsPerPage);
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(currentGroup * pagesPerGroup, totalPages);

  // 2. 이펙트
  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  // 3. 함수
  const fetchPosts = async () => {
    try {
      const url = `/api2/board/selectlist?page=${currentPage}&cnt=${postsPerPage}&text=`;
      const { data } = await axios.get(url);
      console.log(data)
      if (data.list && Array.isArray(data.list)) {
        setPostList(data.list);
      } else {
        alert("게시글 불러오기에 실패했습니다.");
      }
    } catch (error) {
        console.error("불러오기 오류:", error);
      }
  };

  return (
    <div className="board-container">
      {token && (
        <div className="board-header">
          <h2 className="board-title">📋 게시판</h2>
          <button className="write-button" onClick={() => navigate('/board-write')}>
            글쓰기
          </button>
        </div>
      )}
      <table className="board-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>썸네일</th>
            <th>제목</th>
            <th>작성자</th>
            <th>날짜</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {postList.map((post, index) => (
            <tr key={post.no}>
              <td>{postList.length - index}</td>
              <td>
                <img
                  src={post.defaultImg || '/default-thumbnail.jpg'}
                  alt="썸네일"
                  className="thumbnail-img"
                  onError={(e) => (e.target.src = '/default-thumbnail.jpg')}
                />
              </td>
              <td
                className="board-post-title"
                onClick={() => navigate(`/board-detail?no=${post.no}`)}
              >
                {post.title}
              </td>
              <td>{post.member && post.member.nickname ? post.member.nickname : '익명'}</td>
            <td>{post.regdate ? post.regdate.substring(0, 10) : '날짜 없음'}</td>
            <td>{typeof post.hit === 'number' ? post.hit : 0}</td>
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
