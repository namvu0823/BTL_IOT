const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Endpoint: Đăng nhập admin
router.post('/login', adminController.loginAdmin);

// Endpoint: Tạo admin mới (chỉ sử dụng cho khởi tạo)
router.post('/create', adminController.createAdmin);

module.exports = router;
