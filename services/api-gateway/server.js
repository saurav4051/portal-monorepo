const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 5000;

app.use(cors());

// Proxy requests from /api/auth to the auth-service (port 5001)
app.use('/api/auth', createProxyMiddleware({ 
  target: 'http://localhost:5001', 
  changeOrigin: true 
}));

// Proxy requests from /api/expenditure to the expenditure-service (port 5002)
app.use('/api/exp-service', createProxyMiddleware({ 
  target: 'http://localhost:5002', 
  changeOrigin: true 
}));

// New proxy for the Registry Service (port 5003)
app.use('/api/registry', createProxyMiddleware({ 
  target: 'http://localhost:5003', 
  changeOrigin: true 
}));

// A simple non-proxied route
app.get('/', (req, res) => {
    res.send('API Gateway is running!');
});

app.listen(port, () => {
    console.log(`API Gateway running on port ${port}`);
});