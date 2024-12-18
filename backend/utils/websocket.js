const connectDB = require('./db');
const Fingerprint = require('../models/Fingerprint');
const RFID = require('../models/RFID');

module.exports = (wss) => {
  // Kết nối MongoDB
  connectDB();

  wss.on('connection', (ws) => {
    console.log('ESP32 connected');

    ws.on('message', async (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        const { header, UID, status, time, finger_id } = parsedMessage;
  
        if (header === "Check_in request") {
          console.log(`Client check-in with UID: ${UID}`);
          // Sửa ở đây
          //Lấy thông tin đăng nhập(password, vân tay), gửi cho esp32
          //thay dữ liệu trong Json dưới đây bằng dữ liệu thật
          ws.send(JSON.stringify({ header: "Check_in response", UID, password: "password123", finger_id:"6" }));
        } 
  
        else if (header === "response new account") {
          if(status ==="successfully"){
              console.log(`New account creation for UID: ${UID} - Status: ${status} - Finger_id: ${finger_id}`);
              //xử lý tiếp theo
              //lưu vào mongodb
          }
          else if (status ==="failed"){
              console.log(`Failed to create new account for UID: ${UID} - Status: ${status}`);
              //xử lý tiếp theo
              //thông báo lên client
          }
        } 
  
        else if (header === "Check_in successfully")
        {
          console.log(`Check_in successfully :${UID}- Time: ${time}`);
          //xử lý tiếp theo
          //lưu vào mongodb
        }
      
      } catch (err) {
        console.error("Error parsing JSON:", err);
      }
    });

    ws.on('close', () => {
      console.log('ESP32 disconnected');
    });
  });
};
