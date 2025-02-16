const express = require('express');
const { 
  registrarContador, 
  obtenerContadores, 
  editarContador, 
  eliminarContador 
} = require('../controllers/adminController');
const router = express.Router();

// Registrar un contador
router.post('/registrar', registrarContador);

// Obtener los contadores registrados
router.get('/contadores', obtenerContadores);

// Editar un contador
router.put('/editar/:id', editarContador);

// Eliminar un contador
router.delete('/eliminar/:id', eliminarContador);

module.exports = router;
