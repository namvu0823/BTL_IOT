const express = require('express');
const { addRFID, getRFIDByUserId, getAllUserRfid } = require('../controllers/rfidController');

const router = express.Router();

router.get('/rfid',getAllUserRfid)
// Endpoint thêm RFID card
router.post('/addRFID', addRFID);

// Endpoint lấy RFID cards theo userId
router.get('/:userId', getRFIDByUserId);

module.exports = router;
