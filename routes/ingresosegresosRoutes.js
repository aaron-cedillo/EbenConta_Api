// rutas/facturas.js (o el nombre de tu archivo de rutas)
const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middlewares/authenticateJWT');
const ingresosegresosController = require("../controllers/ingresosegresosController");

// Ruta para obtener el resumen de las facturas de un cliente
router.get("/cliente/:ClienteID",authenticateJWT, ingresosegresosController.obtenerFacturasPorCliente);
router.get("/:FacturaID",authenticateJWT, ingresosegresosController.obtenerFacturaPorID);

module.exports = router;
