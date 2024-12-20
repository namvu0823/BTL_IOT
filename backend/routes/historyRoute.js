const express = require('express');
const router = express.Router();
const { saveDoorHistory } = require('../controllers/historyController');

// Route để lưu lịch sử mở cửa
router.post('/savehistory', saveDoorHistory);
router.get('/history', getAllHistory);

module.exports = router;
