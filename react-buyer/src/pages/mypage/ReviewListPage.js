import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/ReviewListPage.css';
import { useDispatch, useSelector } from 'react-redux';

export default function ReviewListPage() {
  const { token } = useSelector(state => state.LoginReducer);
  const [reviewList, setReviewList] = useState([]);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const cnt = 5; // 한 페이지당 리뷰 수
  const [totalPages, setTotalPages] = useState(1);
  const pagesPerGroup = 5;

  const currentGroup = Math.ceil(page / pagesPerGroup);
  const startPage = (currentGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(currentGroup * pagesPerGroup, totalPages);

  useEffect(() => {
    dispatch({ type: 'mypage_menu', idx: "6" });
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      fetchReviewList();
    }
  }, [page, token]);

  const fetchReviewList = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(`/api2/review/list?page=${page}&cnt=${cnt}`, { headers });
    
      if (res.data.status === 1) {
        setReviewList(res.data.list);
        console.log("리뷰 전체 데이터:", res.data.list);
        console.log("리뷰 리스트:", res.data.list.map(r => r.reviewNo));
        const totalCount = res.data.totalCount || 0;
        const pages = Math.ceil(totalCount / cnt);
        setTotalPages(pages > 0 ? pages : 1); // 최소 1페이지
      } else {
        alert("리뷰 목록 조회 실패");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류");
    }
  };

  const handleDelete = async (no) => {
    try {
      const url = `/api2/review/delete`;
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.delete(url, { headers, data: { no } });

      if (data.status === 1) {
        alert("리뷰 삭제 성공!");
        fetchReviewList(); // 삭제 후 새로고침
      } else {
        alert("리뷰 삭제 실패: " + data.message);
      }
    } catch (e) {
      console.error(e);
      alert("서버 오류");
    }
  };

  return (
    <div className="review-list-container">
      <h2>나의 작성 리뷰</h2>
      {reviewList.length === 0 ? (
        <p>아직 작성한 리뷰가 없습니다.</p>
      ) : (
        <>
          <div className="review-card-list">
            {reviewList.map(item => (
              <div className="review-card" key={item.reviewNo}>
                <img src={item.defaultImg} alt="상품 이미지" style={{ width: '150px', borderRadius: '8px' }} />
                <h3>{item.review}</h3>
                <div className="star-display">
                  {[1, 2, 3, 4, 5].map(num => (
                    <span key={`${item.reviewNo}-star-${num}`} style={{ color: item.evaluation >= num ? 'gold' : '#ccc' }}>★</span>
                  ))}
                </div>
                <p>수량: {item.quantity}개</p>
                <p>단가: {item.bookprice.toLocaleString()}원</p>
                <p>총 결제금액: {(item.quantity * item.bookprice).toLocaleString()}원</p>
                <p>작성일: {item.regdate?.substring(0, 10)}</p>
                <button onClick={() => handleDelete(item.reviewNo)}>삭제</button>
              </div>
            ))}
          </div>

          {/* 페이징 버튼 */}
          <div className="pagination">
            {startPage > 1 && (
              <>
                <button onClick={() => setPage(1)}>&laquo;</button> {/* 처음 */}
                <button onClick={() => setPage(startPage - 1)}>&lt;</button> {/* 이전 */}
              </>
            )}

            {Array.from({ length: endPage - startPage + 1 }, (_, idx) => {
              const pageNumber = startPage + idx;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={page === pageNumber ? 'active' : ''}
                >
                  {pageNumber}
                </button>
              );
            })}

            {endPage < totalPages && (
              <>
                <button onClick={() => setPage(endPage + 1)}>&gt;</button> {/* 다음 */}
                <button onClick={() => setPage(totalPages)}>&raquo;</button> {/* 마지막 */}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
