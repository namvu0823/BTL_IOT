const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const connectDB = require('./utils/db');

// Import Routes
const userRoutes = require('./routes/user');
const deviceRoutes = require('./routes/device');
const historyRoutes = require('./routes/history');
const adminRoutes = require('./routes/admin'); // Thêm admin routes

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
app.use('/api/admin', adminRoutes); // Thêm route admin

// WebSocket setup (nếu cần, hiện tại đã comment)
// require('./utils/websocket')(wss);

// Server listener
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
