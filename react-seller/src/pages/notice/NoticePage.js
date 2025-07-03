import './css/NoticePage.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

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



export default function NoticePage() {
  // 1. 변수
  const { userid } = useSelector((state) => state.LoginReducer);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const [postList, setPostList] = useState([]);

  const postsPerPage = 10;
  const pagesPerGroup = 10;

  const totalPages = Math.ceil(postList.length / postsPerPage);
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(currentGroup * pagesPerGroup, totalPages);
  

  

  // ✅ 2.이펙트 (페이지 바뀔 때마다 호출)
  useEffect(() => {
    getList();
  }, [currentPage]);

  // 3. 함수
  const getList = async () => {
    try {
      const url = `/api2/notice/selectlist?page=${currentPage}&cnt=${postsPerPage}&text=`;
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
    <div className="notice-container">
      <div className="notice-header">
        <h2 className="notice-title">📢 공지사항</h2>
      {userid === 'admin' && (
        <button className="write-button" onClick={() => navigate('/notice-write')}>
          글쓰기
        </button>
      )}
      </div>

      <table className="notice-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>썸네일</th> {/* ✅ 썸네일 컬럼 추가 */}
            <th>제목</th>
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
                onClick={() => navigate(`/notice-detail?no=${post.no}`)}
              >
                {post.title}
              </td>
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
