import { message } from 'antd';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const KakaoPay = () => {
  const { token } = useSelector(state => state.LoginReducer);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pgToken = queryParams.get('pg_token');
  console.log(pgToken);
  const navigate = useNavigate();


  useEffect(() => {
    handleKakaoPay();
  }, [])


  const handleKakaoPay = async() => {
    const url = `/api2/pay/completed?pg_token=${pgToken}`;
    const headers = { Authorization: `Bearer ${token}` };
    const {data} = await axios.get(url, {headers});
    console.log(data);

    if(data.status === 1) {
      message.success('결제가 완료 되었습니다.')
      navigate('/');
    }
  };




  return (
    <div>
      
    </div>
  );
};

export default KakaoPay;