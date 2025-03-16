const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middlewares/authenticateJWT");
const { obtenerTotalClientes, obtenerTotalFacturas } = require("../controllers/contadorEstadisticasController");

// Ruta para obtener el total de clientes del contador autenticado
router.get("/clientes/total", authenticateJWT, obtenerTotalClientes);

// Ruta para obtener el total de facturas del contador autenticado
router.get("/facturas/total", authenticateJWT, obtenerTotalFacturas);

module.exports = router;

