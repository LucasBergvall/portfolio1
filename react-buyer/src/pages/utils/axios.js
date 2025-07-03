// src/utils/axios.js 
import axios from 'axios';

const api = axios.create({
  baseURL: '/',  // 필요시 API 서버 경로 작성
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

export default api;