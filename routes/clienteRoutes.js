const express = require('express');
const {
    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
} = require('../controllers/clienteController');

const router = express.Router();

// Rutas de Clientes
router.get('/', getClientes); // Obtener todos los clientes por usuarioID (query)
router.get('/:id', getClienteById); // Obtener un cliente por ID
router.post('/', createCliente); // Crear un nuevo cliente
router.put('/:id', updateCliente); // Actualizar un cliente
router.delete('/:id', deleteCliente); // Eliminar un cliente

module.exports = router;