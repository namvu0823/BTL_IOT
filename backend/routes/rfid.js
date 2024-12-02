const express = require('express');
const { addRFID, getRFIDByUserId } = require('../controllers/rfidController');

const router = express.Router();

// Endpoint thêm RFID card
router.post('/', addRFID);

// Endpoint lấy RFID cards theo userId
router.get('/:userId', getRFIDByUserId);

module.exports = router;
