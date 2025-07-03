import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './css/NoticeDetailPage.css';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function NoticeDetailPage() {

  // 1. 변수  
  const navigate = useNavigate();
  const { userid } = useSelector((state) => state.LoginReducer);
  const [postList, setPostList] = useState(null);
  const [imageList, setImageList] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const no = queryParams.get('no');

  // 2️. 이펙트
  useEffect(() => {
    getNoticeList();
  }, [no]);

  // 3️. 함수
 const getNoticeList = async () => {
  try {
    const { data } = await axios.get(`/api2/notice/select?no=${no}`);
    if (data.status === 1) {
      setPostList(data.post);
      setImageList(data.images);
    } else {
      alert("게시글을 불러오지 못했습니다.");
      navigate("/notice");
    }
  } catch (error) {
    console.error("조회 실패", error);
    alert("서버 오류가 발생했습니다.");
    navigate("/notice");
  }
};


  if (!postList) {
    return (
      <div className="detail-container">
        <p>해당 게시글을 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/notice')}>공지사항으로</button>
      </div>
    );
  }

  
  const handleEdit = () => {
    navigate(`/notice-edit?no=${postList.no}`);
  };

  
  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      alert('삭제되었습니다.');
      navigate('/notice');
    }
  };

  // 4️⃣ 렌더링 영역
  return (
    <div className="detail-container">
      <h2 className="detail-title">{postList.title}</h2>
      <div className="detail-meta">
        <span>날짜: {postList.regdate?.substring(0, 10)}</span>
        <span>조회수: {postList.hit}</span>
      </div>

      {imageList.length > 0 && (
        <div className="detail-images">
          {imageList.map((imgObj) => (
            <img
              key={imgObj.no}
              src={`/api2/img/image?no=${imgObj.img.no}`}
              alt="게시글 이미지"
              className="detail-image"
            />
          ))}
        </div>
      )}

      <div className="detail-content">{postList.text}</div>

      <div className="detail-buttons">
        <button onClick={() => navigate('/notice')}>목록</button>
        {postList?.member?.userid === userid && (
          <>
            <button onClick={handleEdit}>수정</button>
            <button onClick={handleDelete}>삭제</button>
          </>
        )}
      </div>
    </div>
  );
}
