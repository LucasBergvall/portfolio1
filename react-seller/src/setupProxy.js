// react에서 const url = `/api1/...` 은 백엔드로 연동하게 설정
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {

  // 백엔드와 프론트엔드 연결  
  app.use(
    '/api2',
    createProxyMiddleware({
      target: 'http://192.168.0.43:8080/api2',
      changeOrigin: true
    })
  );

  // 챗봇 연결
  app.use(
      '/api3',
      createProxyMiddleware({
        target: 'http://127.0.0.1:8000/api3',
        changeOrigin: true
      })
  );
};