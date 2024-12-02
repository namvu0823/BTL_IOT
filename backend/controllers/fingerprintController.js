const db = require('../utils/db');

exports.addFingerprint = async (req, res) => {
  const { userId, fingerprintData } = req.body;

  if (!userId || !fingerprintData) {
    return res.status(400).json({ error: 'userId and fingerprintData are required' });
  }

  try {
    const sql = 'INSERT INTO fingerprints (user_id, fingerprint_data) VALUES (?, ?)';
    const [result] = await db.query(sql, [userId, fingerprintData]);
    res.status(201).json({ message: 'Fingerprint added', id: result.insertId });
  } catch (error) {
    console.error('Error adding fingerprint:', error); // Log chi tiết lỗi
    res.status(500).json({ error: error.message });    // Trả về lỗi chi tiết cho client
  }
};
