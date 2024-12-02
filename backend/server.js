const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fingerprintRoutes = require('./routes/fingerprint');
const rfidRoutes = require('./routes/rfid');

const app = express();
const cors = require('cors');
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use('/api/fingerprint', fingerprintRoutes);
app.use('/api/rfid', rfidRoutes);

require('./utils/websocket')(wss); // WebSocket xử lý giao tiếp với ESP32

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
