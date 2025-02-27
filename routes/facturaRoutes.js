const express = require("express");
const router = express.Router();
const facturaController = require("../controllers/facturaController");

// Rutas para la gestión de facturas
router.get("/cliente/:ClienteID", facturaController.obtenerFacturasPorCliente);
router.get("/:FacturaID", facturaController.obtenerFacturaPorID);
// Ruta para subir una factura con XML
router.post("/subir", facturaController.upload.single("xml"), facturaController.subirFactura);
router.post("/", facturaController.subirFactura);
router.put("/:FacturaID", facturaController.actualizarFactura);
router.delete("/:FacturaID", facturaController.eliminarFactura);

module.exports = router;
