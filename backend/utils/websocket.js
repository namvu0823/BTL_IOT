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
        const data = JSON.parse(message);
        console.log('Received:', data);

        switch (data.type) {
          case 'fingerprint':
            // Lưu dữ liệu vân tay vào MongoDB
            const newFingerprint = new Fingerprint({
              userId: data.userId,
              fingerprintData: data.fingerprintData,
            });
            await newFingerprint.save();
            ws.send(JSON.stringify({ message: 'Fingerprint data saved' }));
            console.log('Fingerprint data saved');
            break;

          case 'rfid':
            // Lưu dữ liệu RFID vào MongoDB
            const newRFID = new RFID({
              userId: data.userId,
              cardUID: data.cardUID,
            });
            await newRFID.save();
            ws.send(JSON.stringify({ message: 'RFID data saved' }));
            console.log('RFID data saved');
            break;

          case 'test':
            console.log('Test message from ESP32:', data.message);
            ws.send(JSON.stringify({ message: 'Test received successfully' }));
            break;

          default:
            console.log('Unknown data type:', data.type);
            ws.send(JSON.stringify({ error: 'Unknown data type' }));
            break;
        }
      } catch (err) {
        console.error('Invalid JSON received:', message);
        ws.send(JSON.stringify({ error: 'Invalid JSON format' }));
      }
    });

    ws.on('close', () => {
      console.log('ESP32 disconnected');
    });
  });
};
