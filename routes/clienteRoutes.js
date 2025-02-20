const express = require('express');
const router = express.Router();
const { getClientes, addCliente, editCliente, deleteCliente } = require('../controllers/clienteController');

// Listar clientes
router.get('/:userId', getClientes);

// Agregar cliente
router.post('/', addCliente);

// Editar cliente
router.put('/:clienteId', editCliente);

// Eliminar cliente
router.delete('/:clienteId', deleteCliente);

module.exports = router;
