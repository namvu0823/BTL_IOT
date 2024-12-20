const express = require('express');
const { getDeviceByPort, createDevice } = require('../controllers/deviceController');

const router = express.Router();

router.get('/:id_port', getDeviceByPort);
router.post('/', createDevice);

module.exports = router;
