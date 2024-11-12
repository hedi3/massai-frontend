const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/nasdaq',
    createProxyMiddleware({
      target: 'http://loclahost:5000',
      changeOrigin: true,
      pathRewrite: {
        '^/nasdaq': '', // remove /api from the request path
      },
    })
  );
};
