const { sql } = require("../config/db");  // Usamos sql desde la configuración de la base de datos

// Obtener todas las facturas de un cliente, con opción de filtrar por fecha
const obtenerFacturasPorCliente = async (req, res) => {
    try {
        const { ClienteID } = req.params;
        const { fechaInicio, fechaFin } = req.query;

        let query = `SELECT * FROM Facturas WHERE ClienteID = @ClienteID`;
        
        // Declaramos el parámetro ClienteID
        const request = new sql.Request();
        request.input('ClienteID', sql.Int, ClienteID);

        if (fechaInicio && fechaFin) {
            query += ` AND Fecha BETWEEN @fechaInicio AND @fechaFin`;
            request.input('fechaInicio', sql.Date, fechaInicio);
            request.input('fechaFin', sql.Date, fechaFin);
        }

        // Ejecutamos la consulta usando los parámetros
        const result = await request.query(query);
        res.json(result.recordset);  // Asegúrate de usar recordset con SQL Server
    } catch (error) {
        console.error("Error al obtener facturas:", error);
        res.status(500).json({ error: "Error al obtener facturas" });
    }
};

// Obtener una factura específica por su ID
const obtenerFacturaPorID = async (req, res) => {
    try {
        const { FacturaID } = req.params;

        const query = `SELECT * FROM Facturas WHERE FacturaID = @FacturaID`;

        // Declaramos el parámetro FacturaID
        const request = new sql.Request();
        request.input('FacturaID', sql.Int, FacturaID);

        // Ejecutamos la consulta usando los parámetros
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

// Subir una nueva factura
const subirFactura = async (req, res) => {
    try {
        const { ClienteID, Fecha, Total, MetodoPago, Estatus, NumeroFactura, RFCEmisor, EnlacePDF } = req.body;

        const query = `INSERT INTO Facturas (ClienteID, Fecha, Total, MetodoPago, Estatus, NumeroFactura, RFCEmisor, EnlacePDF) 
                       VALUES (@ClienteID, @Fecha, @Total, @MetodoPago, @Estatus, @NumeroFactura, @RFCEmisor, @EnlacePDF)`;

        // Declaramos los parámetros
        const request = new sql.Request();
        request.input('ClienteID', sql.Int, ClienteID);
        request.input('Fecha', sql.Date, Fecha);
        request.input('Total', sql.Decimal, Total);
        request.input('MetodoPago', sql.NVarChar, MetodoPago);
        request.input('Estatus', sql.NVarChar, Estatus);
        request.input('NumeroFactura', sql.NVarChar, NumeroFactura);
        request.input('RFCEmisor', sql.NVarChar, RFCEmisor);
        request.input('EnlacePDF', sql.NVarChar, EnlacePDF);

        // Ejecutamos la consulta
        await request.query(query);

        res.status(201).json({ mensaje: "Factura registrada exitosamente" });
    } catch (error) {
        console.error("Error al subir la factura:", error);
        res.status(500).json({ error: "Error al registrar la factura" });
    }
};

// Actualizar una factura
const actualizarFactura = async (req, res) => {
    try {
        const { FacturaID } = req.params;
        const { Fecha, Total, MetodoPago, Estatus, NumeroFactura, RFCEmisor, EnlacePDF } = req.body;

        const query = `UPDATE Facturas 
                       SET Fecha = @Fecha, Total = @Total, MetodoPago = @MetodoPago, Estatus = @Estatus, 
                           NumeroFactura = @NumeroFactura, RFCEmisor = @RFCEmisor, EnlacePDF = @EnlacePDF
                       WHERE FacturaID = @FacturaID`;

        // Declaramos los parámetros
        const request = new sql.Request();
        request.input('Fecha', sql.Date, Fecha);
        request.input('Total', sql.Decimal, Total);
        request.input('MetodoPago', sql.NVarChar, MetodoPago);
        request.input('Estatus', sql.NVarChar, Estatus);
        request.input('NumeroFactura', sql.NVarChar, NumeroFactura);
        request.input('RFCEmisor', sql.NVarChar, RFCEmisor);
        request.input('EnlacePDF', sql.NVarChar, EnlacePDF);
        request.input('FacturaID', sql.Int, FacturaID);

        // Ejecutamos la consulta
        const result = await request.query(query);

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: "Factura no encontrada" });
        }

        res.json({ mensaje: "Factura actualizada exitosamente" });
    } catch (error) {
        console.error("Error al actualizar la factura:", error);
        res.status(500).json({ error: "Error al actualizar la factura" });
    }
};

// Eliminar una factura
const eliminarFactura = async (req, res) => {
    try {
        const { FacturaID } = req.params;

        const query = `DELETE FROM Facturas WHERE FacturaID = @FacturaID`;

        // Declaramos el parámetro
        const request = new sql.Request();
        request.input('FacturaID', sql.Int, FacturaID);

        // Ejecutamos la consulta
        const result = await request.query(query);

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: "Factura no encontrada" });
        }

        res.json({ mensaje: "Factura eliminada exitosamente" });
    } catch (error) {
        console.error("Error al eliminar la factura:", error);
        res.status(500).json({ error: "Error al eliminar la factura" });
    }
};

module.exports = {
    obtenerFacturasPorCliente,
    obtenerFacturaPorID,
    subirFactura,
    actualizarFactura,
    eliminarFactura,
};
