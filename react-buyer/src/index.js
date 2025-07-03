import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { message } from 'antd';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';

// redux 환경설정
import { Provider } from 'react-redux';
import RootReducer from './reducer'
import { configureStore } from '@reduxjs/toolkit'
const store = configureStore({ reducer: RootReducer})

const root = ReactDOM.createRoot(document.getElementById('root'));

message.config({
  top: 100, // 메시지가 얼마나 아래에서 시작할지
  duration: 2,
  maxCount: 3,
  style: { zIndex: 9999 }
});

root.render(

    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
