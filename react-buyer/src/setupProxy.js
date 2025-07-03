

// react에서 const url = `/api1/...` 은 백엔드로 연동하게 설정
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api2',
        createProxyMiddleware({
          target : 'http://127.0.0.1:8080/api2',
          changeOrigin : true
        })
    )

    app.use(
      '/api3',
      createProxyMiddleware({
        target: 'http://127.0.0.1:8000/api3',
        changeOrigin: true
      })
  );
}