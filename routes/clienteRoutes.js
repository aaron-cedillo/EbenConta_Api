const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authenticateJWT');
const clienteController = require('../controllers/clienteController');

// Obtener todos los clientes
router.get('/', authenticateJWT, clienteController.getClientes);

// Agregar un nuevo cliente
router.post('/', authenticateJWT, clienteController.addCliente);

// Editar un cliente
router.put('/:id', authenticateJWT, clienteController.updateCliente);

// Eliminar un cliente
router.delete('/:id', authenticateJWT, clienteController.deleteCliente);

module.exports = router;
