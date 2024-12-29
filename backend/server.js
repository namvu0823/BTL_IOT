const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const fs = require('fs'); // Để quản lý file password.json
const connectDB = require('./utils/db');

// Import Routes
const userRoutes = require('./routes/user');
const deviceRoutes = require('./routes/device');
const historyRoutes = require('./routes/history');
const adminRoutes = require('./routes/admin');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Kết nối MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/admin', adminRoutes);

// Endpoint: Tạo hoặc thay đổi mật khẩu mở khóa
app.post('/api/password', (req, res) => {
  const { password } = req.body;

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Password is required and must be a string.',
    });
  }

  // Lưu mật khẩu vào file password.json
  const passwordData = { password };

  fs.writeFile('./password.json', JSON.stringify(passwordData, null, 2), (err) => {
    if (err) {
      console.error('Error writing password file:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to save password.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
    });
  });
});

// Endpoint: Đọc mật khẩu mở khóa
app.get('/api/password', (req, res) => {
  fs.readFile('./password.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading password file:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to read password.',
      });
    }

    const passwordData = JSON.parse(data);
    return res.status(200).json({
      success: true,
      message: 'Password retrieved successfully.',
      data: passwordData,
    });
  });
});

// WebSocket setup (nếu cần, hiện tại đã comment)
// require('./utils/websocket')(wss);

// Server listener
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
