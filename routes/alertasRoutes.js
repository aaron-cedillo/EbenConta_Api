const express = require('express');
const router = express.Router();
const alertaController = require('../controllers/alertasController');
const authenticate = require('../middlewares/authenticateJWT');

// Ruta para crear una nueva alerta
router.post('/', authenticate, alertaController.crearAlerta);

// Ruta para obtener las alertas del usuario autenticado
router.get('/', authenticate, alertaController.obtenerAlertas);

// Ruta para actualizar el estado de una alerta
router.put('/:id/estado', authenticate, alertaController.actualizarEstadoAlerta);

// Ruta para eliminar una alerta
router.delete('/:id', authenticate, alertaController.eliminarAlerta);

module.exports = router;
