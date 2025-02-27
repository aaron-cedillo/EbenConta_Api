const express = require('express');
const router = express.Router();
const { getClienteById } = require('../controllers/clienteDashboardController');
const authenticateJWT = require('../middlewares/authenticateJWT');

router.get('/clientedashboard/:id', authenticateJWT, getClienteById);

module.exports = router;
