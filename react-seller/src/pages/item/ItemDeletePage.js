import axios from 'axios';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const ItemDeletePage = () => {
  const location = useLocation();

  // 1. 변수
  const queryParams = new URLSearchParams(location.search);
  const no = queryParams.get('no');
  const { token } = useSelector((state) => state.LoginReducer);
  const navigate = useNavigate();
  
  console.log("삭제할 번호:", no); // 예: "49"

  // 2. 이펙트
  useEffect(() => {
      if(window.confirm("정말 삭제하시겠습니까?")) {
        deleteItem();
      }
      navigate("/item/select")
    }, []);
  

  
  // 3. 함수
  const deleteItem = async() => {
    const url = `/api2/item/delete`
    const body = {"no" : no }
    const headers = {"Authorization" : token}
    const {data} = await axios.put(url, body, {headers});
    console.log(data);
    if(data.status === 1) {
      alert("삭제를 성공했습니다.");
    }
  }


  return (
    <div>
      
    </div>
  );
};

export default ItemDeletePage;