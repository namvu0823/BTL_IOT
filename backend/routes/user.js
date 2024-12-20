const express = require('express');
const { getUserByUID, createUser } = require('../controllers/userController');

const router = express.Router();

router.get('/:UID', getUserByUID);
router.post('/', createUser);

module.exports = router;
