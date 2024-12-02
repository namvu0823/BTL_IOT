const db = require('./db'); // Kết nối cơ sở dữ liệu

module.exports = (wss) => {
  wss.on('connection', (ws) => {
    console.log('ESP32 connected');

    ws.on('message', async (message) => {
      try {
        // Parse JSON từ ESP32
        const data = JSON.parse(message);
        console.log('Received:', data);

        // Kiểm tra loại dữ liệu (type)
        switch (data.type) {
          case 'fingerprint':
            // Xử lý dữ liệu vân tay
            const fingerprintSql = 'INSERT INTO fingerprints (user_id, fingerprint_data) VALUES (?, ?)';
            await db.query(fingerprintSql, [data.userId, data.fingerprintData]);
            ws.send(JSON.stringify({ message: 'Fingerprint data saved' }));
            console.log('Fingerprint data saved');
            break;

          case 'rfid':
            // Xử lý dữ liệu RFID
            const rfidSql = 'INSERT INTO rfid_cards (user_id, card_uid) VALUES (?, ?)';
            await db.query(rfidSql, [data.userId, data.cardUID]);
            ws.send(JSON.stringify({ message: 'RFID data saved' }));
            console.log('RFID data saved');
            break;

          case 'test':
            // Xử lý dữ liệu kiểm tra
            console.log('Test message from ESP32:', data.message);
            ws.send(JSON.stringify({ message: 'Test received successfully' }));
            break;

          default:
            // Loại dữ liệu không xác định
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
