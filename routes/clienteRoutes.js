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

router.put("/archivar/:id", authenticateJWT, clienteController.archivarCliente);

// Obtener clientes archivados
router.get('/archivados', authenticateJWT, clienteController.getClientesArchivados);

// Restaurar un cliente archivado
router.put('/restaurar/:id', authenticateJWT, clienteController.restaurarCliente);

// Obtener el nombre de un cliente por su ID
router.get('/:id', authenticateJWT, clienteController.getClientePorID);

module.exports = router;
