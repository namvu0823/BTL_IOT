const express = require('express');
const { getDeviceByPort, createDevice, getAllDevices, deleteDevice } = require('../controllers/deviceController');

const router = express.Router();

router.get('/:id_port', getDeviceByPort); //lấy thiết bị theo id_port
router.post('/', createDevice); //tạo thiết bị
router.get('/',getAllDevices); //lấy tất cả thiết bị
router.delete('/:id_port', deleteDevice); //xóa thiết bị

module.exports = router;
