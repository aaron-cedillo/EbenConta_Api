const { sql } = require("../config/db");

// Obtener el resumen de facturas de un cliente con filtro de fecha
const obtenerFacturasPorCliente = async (req, res) => {
    try {
        const { ClienteID } = req.params;
        const { fechaInicio, fechaFin } = req.query;

        let query = `SELECT Fecha, Total, Tipo FROM Facturas WHERE ClienteID = @ClienteID`;

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

module.exports = {
    obtenerFacturasPorCliente
};
