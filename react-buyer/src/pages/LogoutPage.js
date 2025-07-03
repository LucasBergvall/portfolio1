// src / pages / LogoutPage.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogoutPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.LoginReducer);
    const handlelogout = async() => { 
        if (window.confirm('로그아웃??')) {
            const headers = { "Authorization" : "Bearer " + token }
            console.log(headers);
            const { data } = await axios.post('/api2/member/logout', {}, { headers } );
            console.log(data);
            if(data.status === 1) {
                dispatch({type : 'logout'});
                navigate('/');
            } 
            else {
                alert(data.message);
            }
        } else {
            navigate('/');
        }
    }

    // [] 로그아웃 페이지 실행시 최초1회 실행
   // LogoutPage.js
    useEffect(() => {
        handlelogout()
    }, []);

            
    return (
        <div>
        </div>
    );
};

export default LogoutPage;