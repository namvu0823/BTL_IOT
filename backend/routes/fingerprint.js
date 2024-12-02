const express = require('express');
const { addFingerprint } = require('../controllers/fingerprintController');
const router = express.Router();

router.post('/', addFingerprint);

module.exports = router;
