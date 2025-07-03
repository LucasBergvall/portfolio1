import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './css/NoticeEditPage.css'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { message } from 'antd';


export default function BoardEditPage() {

  // 1. 변수
  const { token } = useSelector(state => state.LoginReducer)
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
   
 
  const [previewUrls, setPreviewUrls] = useState([]); // ✅ 새로운 이미지 리스트(화면상)
  const [newImageList, setNewImageList] = useState([]); // ✅ 새로운 이미지 url 리스트(백엔드로 전송할 데이터)
  const [imageList, setImageList] = useState([]); // ✅ 기존 이미지 url 리스트

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const no = queryParams.get('no');

  // 2. 이펙트

  useEffect(() => {
    getinfo();
  }, [no]);

  // 3. 함수

  const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      console.log(files)
      setNewImageList(files);
      const previews = files.map((file) => URL.createObjectURL(file));
      console.log(previews);
      setPreviewUrls(previews);
    };

  const getinfo = async() => {

      try {
        const headers = {Authorization: `Bearer ${token}`};
        const {data} = await axios.get(`/api2/notice/select?no=${no}`, {headers})
        console.log(data);
        
        if (data.status === 1) {
          setTitle(data.post.title);
          setContent(data.post.text);
          setImageList(data.images);  // 보정 필요 없음 (항상 배열이니까)
        } else {
          alert('해당 글을 불러 올 수 없습니다.');
        }
          
      } catch (error) {
         alert('서버에러');
      }
  }
  
  const handleImageDelete = async (imgNo) => {
    if (!window.confirm('이미지를 삭제하시겠습니까?')) return;

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      console.log(headers);

      const body = {
        nno: Number(no),
        imno: imgNo,
      };
      console.log(body);

      const { data } = await axios.delete('/api2/actionnotice/delete', { headers: headers, data: body });

      if (data.status === 1) {
        // 성공 시 이미지 리스트에서 제거
        setImageList(prev => prev.filter(img => img.img.no !== imgNo));
      } else {
        alert('삭제 실패: ' + data.message);
      }
    } catch (error) {
        console.error('에러 발생', error);
        alert('서버 오류');
      }
  };

  const onFinish = async (e) => {
    e.preventDefault();
    console.log(e);
      
    try {
      const formData = new FormData();
      const notice = {"no": no, "title": title, "text": content}
      formData.append("notice", new Blob([JSON.stringify(notice)], { type: "application/json" }));
      if (Array.isArray(newImageList) && newImageList.length > 0) {
        newImageList.forEach((file) => {
          formData.append("img", file);
        });
      } else {
        // 이미지가 없는 경우 백엔드에서 @RequestPart(value = "img", required = false)로 처리됨
        console.log("업로드할 이미지가 없습니다.");
      }
      const headers = {Authorization: `Bearer ${token}`};
      const { data } = await axios.put(`/api2/notice/update`, formData, {headers});
        console.log(data);
      if(data.status === 1) {
        setPreviewUrls([]);
        setNewImageList([]);
        setImageList([]);
        navigate(`/notice-detail?no=${no}`);
      }
        
      } catch (error) {
        error('error')
      }
        
  }

  return (
    <div className="write-container">
      <h2 className="write-title">📢 공지사항 수정</h2>
      <form className="write-form" onSubmit={onFinish}>
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
          multiple
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

        {imageList.length > 0 && (
          <div className="image-preview">
            {imageList.map((img, idx) => (
              <div key={img.img.no} className="image-box">
                <img src={`/api2/img/image?no=${img.img.no}`} alt={`기존 이미지 ${idx + 1}`} />
                <button type="button" onClick={() => handleImageDelete(img.img.no)}>삭제</button>
              </div>
            ))}
          </div>
        )}

        <div className="write-buttons">
          <button type="submit" className="submit-button">수정하기</button>
          <button type="button" className="cancel-button" onClick={() => navigate('/notice')}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
