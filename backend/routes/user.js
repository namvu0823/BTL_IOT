const express = require('express');
const { getUserByUID, createUser, getAllUser, deleteUser, updateUser } = require('../controllers/userController');


const router = express.Router();



router.get('/:UID',getUserByUID);; //lấy user theo UID
router.post('/', createUser); //tạo user
router.get('/', getAllUser); //lấy tất cả user
router.put('/finger', updateUser); //update user
router.delete('/:UID',deleteUser); //xóa user


module.exports = router;
