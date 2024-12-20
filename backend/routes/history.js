const express = require('express');
const { getHistoryByPort, createHistory } = require('../controllers/historyController');

const router = express.Router();

router.get('/:id_port', getHistoryByPort);
router.post('/', createHistory);

module.exports = router;
