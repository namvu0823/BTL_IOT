const express = require('express');
const { addFingerprint, getAllUserFingerprint } = require('../controllers/fingerprintController');
const router = express.Router();

router.get('/fingerprint',getAllUserFingerprint)
router.post('/addFingerprint', addFingerprint);

module.exports = router;
