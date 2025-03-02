const { sql } = require("../config/db");

// Función para obtener el resumen de facturas de un cliente
const obtenerResumenFacturasPorCliente = async (req, res) => {
    try {
        const { ClienteID } = req.params;

        // Consulta para obtener solo los datos necesarios y formatearlos correctamente
        const query = `
            SELECT 
                CONVERT(VARCHAR, Fecha, 23) AS fecha, 
                CASE 
                    WHEN Tipo = 'I' THEN 'Ingreso' 
                    WHEN Tipo = 'E' THEN 'Egreso' 
                    ELSE Tipo 
                END AS tipo,
                Total AS monto
            FROM Facturas
            WHERE ClienteID = @ClienteID
        `;

        const request = new sql.Request();
        request.input("ClienteID", sql.Int, ClienteID);

        const result = await request.query(query);

        console.log("Datos obtenidos de la BD:", result.recordset); // Depuración

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "No se encontraron facturas para este cliente" });
        }

        res.json(result.recordset);
    } catch (error) {
        console.error("Error al obtener el resumen de facturas:", error);
        res.status(500).json({ error: "Error al obtener el resumen de facturas" });
    }
};

module.exports = {
    obtenerResumenFacturasPorCliente,
};
