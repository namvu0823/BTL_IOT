const express = require('express');
const { getUserByUID, createUser, getAllUser, deleteUser } = require('../controllers/userController');


const router = express.Router();



router.get('/:UID',getUserByUID)
router.post('/', createUser)
router.get('/', getAllUser)
router.delete('/:UID',deleteUser)


module.exports = router;
