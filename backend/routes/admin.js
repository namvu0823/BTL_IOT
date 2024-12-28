const express = require('express');
const { getAdmin, updateAdmin } = require('../controllers/adminController');


const router = express.Router();


router.get('/', getAdmin); 
router.put('/:_id', updateAdmin); 


module.exports = router;
