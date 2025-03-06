const express = require("express");
const router = express.Router();
const authenticateJWT = require('../middlewares/authenticateJWT');
const facturaController = require("../controllers/facturaController");

// Rutas para la gestión de facturas
router.get("/cliente/:ClienteID",authenticateJWT, facturaController.obtenerFacturasPorCliente);
router.get("/:FacturaID",authenticateJWT, facturaController.obtenerFacturaPorID);
// Ruta para subir una factura con XML
router.post("/subir",authenticateJWT, facturaController.upload.single("xml"), facturaController.subirFactura);
router.put("/:FacturaID", authenticateJWT, facturaController.actualizarFactura);
router.delete("/:FacturaID",authenticateJWT, facturaController.eliminarFactura);

module.exports = router;
