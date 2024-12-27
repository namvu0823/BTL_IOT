const express = require('express');
const { getUserByUID, createUser, getAllUser, deleteUser, updateUser } = require('../controllers/userController');


const router = express.Router();



router.get('/:UID',getUserByUID)
router.post('/', createUser)
router.get('/', getAllUser)
router.put('/:UID', updateUser);
router.delete('/:UID',deleteUser)


module.exports = router;
