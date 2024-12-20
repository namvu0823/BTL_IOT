const express = require('express');
const http = require('http');
const WebSocket = require('ws');
<<<<<<< HEAD
const historyRoutes = require('./routes/historyRoutes'); 
=======
const cors = require('cors');
const connectDB = require('./utils/db');

// Routes
const userRoutes = require('./routes/user');
const deviceRoutes = require('./routes/device');
const historyRoutes = require('./routes/history');

require('dotenv').config();
>>>>>>> d9d9bc9a9195b3425b3b4f7fb1633c2fa5d2e141

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Kết nối MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
<<<<<<< HEAD

app.use('/api', historyRoutes);
=======
>>>>>>> d9d9bc9a9195b3425b3b4f7fb1633c2fa5d2e141

// Routes
app.use('/api/users', userRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/history', historyRoutes);

// WebSocket setup
require('./utils/websocket')(wss);

// Server listener
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
