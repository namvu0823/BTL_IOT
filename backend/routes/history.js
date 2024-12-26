const express = require('express');
const { getHistoryByPort, saveHistory, getAllHistory } = require('../controllers/historyController');

const router = express.Router();

router.get('/:id_port', getHistoryByPort);
router.post('/', saveHistory);
router.get('/',getAllHistory)


module.exports = router;
