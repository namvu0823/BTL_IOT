const express = require('express');
const { getUserByUID, createUser, getAllUser } = require('../controllers/userController');

const router = express.Router();

router.get('/:UID', getUserByUID);
router.post('/', createUser);
router.get('/', getAllUser)

module.exports = router;
