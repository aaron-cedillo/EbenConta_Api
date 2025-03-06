const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middlewares/authenticateJWT');
const ingresosegresosController = require("../controllers/ingresosegresosController");

// Ruta para obtener el resumen de las facturas de un cliente con filtro de fecha
router.get("/cliente/:ClienteID", authenticateJWT, ingresosegresosController.obtenerFacturasPorCliente);

module.exports = router;
