import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './css/BoardDetailPage.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function BoardDetailPage() {
  // 1. 변수
  const navigate = useNavigate();
  const { token, userid } = useSelector((state) => state.LoginReducer);
  const [postList, setPostList] = useState(null);
  const [imageList, setImageList] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const no = queryParams.get('no');
  const [editReplyId, setEditReplyId] = useState(null); // 수정 중인 댓글 ID
  const [editReplyText, setEditReplyText] = useState(''); // 수정 중 텍스트
  const [chk, setChk] = useState(false);

  // 4. 댓글 관련 상태
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState([])

  // 2. 이펙트
  useEffect(() => {
    if (no) {
      fetchReplies();
    }
  }, [no,chk]);

  useEffect(() => {
    fetchPost();
  }, [no, navigate]);

  useEffect(() => {
  if (postList && postList.member) {
    console.log("작성자 ID:", postList.member.userid);
    console.log("현재 로그인 ID:", userid);
  }
}, [postList, userid]);

  // 3. 함수
  const handleToggle = () => {
      setChk(prev => !prev); // true <-> false
    };

  const handleEditStart = (reply) => {
    setEditReplyId(reply.no);
    setEditReplyText(reply.rtext);
  };

  const handleEditCancel = () => {
    setEditReplyId(null);
    setEditReplyText('');
  };

  const handleEditConfirm = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = { no: editReplyId, rtext: editReplyText };

      const { data } = await axios.put('/api2/breply/update', body, { headers });
      if (data.status === 1) {
        alert('댓글이 수정되었습니다.');
        setEditReplyId(null);
        setEditReplyText('');
        handleToggle();
      } else {
        alert('수정 실패: ' + data.message);
      }
    } catch (err) {
      console.error('수정 오류', err);
      alert('서버 오류');
    }
  };

  const handleReplyDelete = async (no) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = { no: no };

      const { data } = await axios.delete('/api2/breply/delete', {
        headers : headers,
        data : body,
      });

      if (data.status === 1) {
        alert('삭제되었습니다.');
        handleToggle();
      } else {
        alert('삭제 실패: ' + data.message);
      }
    } catch (err) {
      alert('서버 오류');
    }
  };

  // 댓글 등록
  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const body = {
        rtext: replyText,
        board: { no: postList.no },
      };
      console.log(body);

      const { data } = await axios.post('/api2/breply/insert', body, { headers });
      if (data.status === 1) {
        alert("댓글이 등록되었습니다.");
        setReplyText('');
        handleToggle();
      } else {
        alert("등록 실패: " + data.message);
      }
    } catch (err) {
      alert("오류 발생");
    }
  };
  
  // 댓글 목록 불러오기
  const fetchReplies = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.get(`/api2/breply/list?bno=${no}`, { headers });

      console.log("📦 전체 응답:", data); // ✅ 여기
      console.log("📢 댓글 리스트:", data.list); // ✅ 여기도

      if (data.status === 1 && Array.isArray(data.list)) {
        setReplies(data.list);
      } else {
        setReplies([]); // fallback
      }
    } catch (err) {
      console.error("댓글 조회 오류", err);
    }
  };

  const handleEdit = () => {
    navigate(`/board-edit?no=${no}`);
  };

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const body = { no: postList.no };

        const { data } = await axios.delete('/api2/board/delete', {
          headers,
          data: body,
        });

        if (data.status === 1) {
          alert("삭제가 완료되었습니다.");
          navigate("/board");
        } else {
          alert("삭제 실패: " + data.message);
        }
      } catch (error) {
        console.error("삭제 오류", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api2/board/select?no=${no}`);
        console.log('📷 이미지 데이터 구조 확인:', data);
        if (data.status === 1) {
          setPostList(data.post);
          setImageList(data.images); // ex) [{no:1, url:...}, ...]
        } else {
          alert("게시글을 불러오지 못했습니다.");
          navigate("/board");
        }
      } catch (error) {
        console.error("조회 실패", error);
        alert("서버 오류가 발생했습니다.");
        navigate("/board");
      }
  };

  if (!postList) {
    return (
      <div className="detail-container">
        <p>해당 게시글을 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/board')}>게시판으로</button>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <h2 className="detail-title">{postList.title}</h2>
      <div className="detail-meta">
        <span>작성자: {postList.member?.nickname || "작성자"}</span>
        <span>날짜: {postList.regdate?.substring(0, 10)}</span>
        <span>조회수: {postList.hit}</span>
      </div>

      {/* 이미지 영역 */}
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
        <div className="reply-section">
          <h3>댓글</h3>
      {token ? (
        <>
          {/* 댓글 입력 */}
          <div className="reply-input">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="댓글을 입력하세요..."
            />
          </div>

          {/* 댓글 등록 버튼만 */}
          <div className="reply-buttons">
            <button onClick={handleReplySubmit}>등록</button>
          </div>
        </>
      ) : (
        <p style={{ color: '#888', fontSize: '14px' }}>
          댓글 작성은 로그인 후 이용하실 수 있습니다.
        </p>
      )}

          {/* 댓글 목록 */}
          {replies.length === 0 ? (
            <p>아직 댓글이 없습니다.</p>
          ) : (
            <ul className="reply-list">
              {replies.map((r) => (
                <li key={r.no} className="reply-item">
                  <div className="reply-header">
                    <strong className="reply-nickname">{r.member?.nickname}</strong>
                    <span className="reply-date">{r.regdate?.substring(0, 10)}</span>
                  </div>

                  {editReplyId === r.no ? (
                    <>
                      <textarea
                        value={editReplyText}
                        onChange={(e) => setEditReplyText(e.target.value)}
                      />
                      <div className="reply-buttons">
                        <button onClick={handleEditConfirm}>확인</button>
                        <button onClick={handleEditCancel}>취소</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="reply-text">{r.rtext}</div>
                      {r.member?.userid === userid && (
                        <div className="reply-actions">
                          <button onClick={() => handleEditStart(r)}>수정</button>
                          <button onClick={() => handleReplyDelete(r.no)}>삭제</button>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

      <div className="detail-buttons">
        <button onClick={() => navigate('/board')}>목록</button>
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
