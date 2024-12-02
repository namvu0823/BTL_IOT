const db = require('../utils/db');

exports.addRFID = async (req, res) => {
  const { userId, cardUID } = req.body;

  try {
    const sql = 'INSERT INTO rfid_cards (user_id, card_uid) VALUES (?, ?)';
    const [result] = await db.query(sql, [userId, cardUID]);
    res.status(201).json({ message: 'RFID card added', id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRFIDByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const sql = 'SELECT * FROM rfid_cards WHERE user_id = ?';
    const [rows] = await db.query(sql, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No RFID cards found for this user' });
    }

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
