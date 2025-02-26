const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Obtener todos los clientes
router.get('/', clienteController.getClientes);

// Agregar un nuevo cliente
router.post('/', clienteController.addCliente);

// Editar un cliente
router.put('/:id', clienteController.updateCliente);

// Eliminar un cliente
router.delete('/:id', clienteController.deleteCliente);

module.exports = router;
