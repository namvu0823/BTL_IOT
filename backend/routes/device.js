const express = require('express');
const { getDeviceByPort, createDevice, getAllDevices, deleteDevice } = require('../controllers/deviceController');

const router = express.Router();

router.get('/:id_port', getDeviceByPort);
router.post('/', createDevice);
router.get('/',getAllDevices)
router.delete('/:id_port', deleteDevice)

module.exports = router;
