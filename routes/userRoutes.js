const express = require('express');
const { loginUser, getUsers } = require('../controllers/userController');
const router = express.Router();

router.post('/login', loginUser);
router.get('/', getUsers); 

module.exports = router;
