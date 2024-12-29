const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
// const fs = require('fs'); // Để quản lý file password.json
const connectDB = require('./utils/db');

// Import Routes
const userRoutes = require('./routes/user');
const deviceRoutes = require('./routes/device');
const historyRoutes = require('./routes/history');
const adminRoutes = require('./routes/admin');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

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


app.post('/api/thongbao_user_moi', (req, res) => {
    try {
        const { id_port, header, UID } = req.body;

        // Kiểm tra đầu vào
        if (!id_port || !header || !UID) {
            return res.status(400).json({
                success: false,
                message: 'id_port, header, and UID are required'
            });
        }

        wsHandler.sendToESP32({ header, UID }, id_port);
        console.log(`Đã gửi thông báo tới thiết bị có ID: ${id_port}`);
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send notification'
        });
    }
});



// Server listener
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// WebSocket setup
const wss = new WebSocket.Server({ port: 8080 });
const WebSocketHandler = require('./utils/websocket');
const wsHandler = new WebSocketHandler(wss);