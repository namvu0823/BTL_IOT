const express = require('express');
const { getAdmin, updateAdmin } = require('../controllers/adminController');


const router = express.Router();


router.get('/', getAdmin); //lấy tất cả user
router.put('/:UID', updateAdmin); //update user


module.exports = router;
