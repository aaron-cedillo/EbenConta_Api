const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Obtener todos los clientes
router.get('/clientes', clienteController.getClientes);

// Agregar un nuevo cliente
router.post('/clientes', clienteController.addCliente);

// Editar un cliente
router.put('/clientes/:id', clienteController.updateCliente);

// Eliminar un cliente
router.delete('/clientes/:id', clienteController.deleteCliente);

module.exports = router;
