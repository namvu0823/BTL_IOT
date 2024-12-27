const User = require('../models/User');
const History = require('../models/History');

module.exports = (wss) => {
  wss.on('connection', (ws) => {
    console.log('ESP32 connected');

    ws.on('message', async (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        const { header, UID, status, time, finger_id } = parsedMessage;

        if (header === "Check_in request") {
          const user = await User.findOne({ UID });
          if (user) {
            ws.send(JSON.stringify({
              header: "Check_in response",
              UID,
              password: "example-password", // Thay bằng dữ liệu thực nếu có
              finger_id: user.finger ? "valid" : "invalid",
            }));
          } else {
            ws.send(JSON.stringify({ header: "Check_in response", status: "User not found" }));
          }
        }

        if (header === "response new account") {
          if (status === "successfully") {
            console.log(`Account creation success for UID: ${UID}`);
            await User.create({
              UID,
              finger: true,
              date_update: new Date().toISOString(),
              name: "New User",
              email: "example@example.com",
            });
          } else {
            console.log(`Account creation failed for UID: ${UID}`);
          }
        }

        if (header === "Check_in successfully") {
          console.log(`Check_in successfully for UID: ${UID}`);
          await History.create({
            id_port: "default-port",
            UID,
            time_in: time,
            status: true,
          });
        }
      } catch (err) {
        console.error("Error processing WebSocket message:", err.message);
      }
    });

    ws.on('close', () => {
      console.log('ESP32 disconnected');
    });
  });
};
