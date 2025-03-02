const { sql } = require("../config/db");

// Función para obtener el resumen de facturas de un cliente
const obtenerFacturasPorCliente = async (req, res) => {
    try {
        const { ClienteID } = req.params;
        const { fechaInicio, fechaFin } = req.query;

        let query = `SELECT * FROM Facturas WHERE ClienteID = @ClienteID`;

        const request = new sql.Request();
        request.input("ClienteID", sql.Int, ClienteID);

        if (fechaInicio && fechaFin) {
            query += ` AND Fecha BETWEEN @fechaInicio AND @fechaFin`;
            request.input("fechaInicio", sql.Date, fechaInicio);
            request.input("fechaFin", sql.Date, fechaFin);
        }

        const result = await request.query(query);
        res.json(result.recordset);
    } catch (error) {
        console.error("Error al obtener facturas:", error);
        res.status(500).json({ error: "Error al obtener facturas" });
    }
};

const obtenerFacturaPorID = async (req, res) => {
    try {
        const { FacturaID } = req.params;

        const facturaIDInt = parseInt(FacturaID, 10);
        if (isNaN(facturaIDInt)) {
            return res.status(400).json({ error: "FacturaID debe ser un número válido" });
        }

        const query = `SELECT * FROM Facturas WHERE FacturaID = @FacturaID`;

        const request = new sql.Request();
        request.input("FacturaID", sql.Int, facturaIDInt);

        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Factura no encontrada" });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error("Error al obtener la factura:", error);
        res.status(500).json({ error: "Error al obtener la factura" });
    }
};

module.exports = {
    obtenerFacturaPorID,
    obtenerFacturasPorCliente,
};
