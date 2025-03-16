const express = require('express');
const router = express.Router();
const { getContadorProfile, updateContador, changeContadorPassword } = require('../controllers/contadorController');

// Obtener el perfil de un contador
router.get('/contador/:contadorId', getContadorProfile);

// Actualizar los datos del contador
router.put('/contador/editar/:contadorId', updateContador);

// Cambiar la contraseña del contador
router.put('/contador/cambiar-password/:contadorId', changeContadorPassword);

module.exports = router;
