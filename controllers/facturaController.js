const { sql } = require("../config/db"); 
const multer = require("multer");
const xml2js = require("xml2js");

// Configuración de multer para almacenar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Función para procesar el XML en memoria
const procesarXML = async (xmlBuffer) => {
    try {
        const xml = xmlBuffer.toString("utf-8"); // Convertir el buffer a string
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xml);
        return result;
    } catch (error) {
        throw new Error("Error al procesar el XML");
    }
};

// Obtener todas las facturas de un cliente, con opción de filtrar por fecha
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

// Obtener una factura específica por su ID
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

// Subir una nueva factura sin guardarla en una carpeta
const subirFactura = async (req, res) => {
    try {
        console.log("REQ.BODY:", req.body);
        console.log("REQ.FILE:", req.file);

        const { ClienteID } = req.body;
        const xmlFile = req.file;

        if (!ClienteID) {
            return res.status(400).json({ error: "ClienteID es requerido" });
        }

        if (!xmlFile) {
            return res.status(400).json({ error: "No se ha subido un archivo XML" });
        }

        // Procesar el XML
        const datosXML = await procesarXML(xmlFile.buffer);
        console.log("DATOS DEL XML:", datosXML);

        // Extraer valores necesarios
        const comprobante = datosXML["cfdi:Comprobante"];
        if (!comprobante || !comprobante["$"]) {
            return res.status(400).json({ error: "El XML no contiene un Comprobante válido." });
        }

        const Total = comprobante["$"].Total;
        let SubTotal = comprobante["$"].SubTotal || 0.00;
        const RFCReceptor = datosXML["cfdi:Comprobante"]?.["cfdi:Receptor"]?.["$"]?.["Rfc"];
        const UUID = datosXML["cfdi:Comprobante"]?.["cfdi:Complemento"]?.["tfd:TimbreFiscalDigital"]?.["$"]?.["UUID"];
        const FechaEmision = comprobante["$"].Fecha;
        const Tipo = comprobante["$"].TipoDeComprobante; // "I" para Ingreso, "E" para Egreso

        if (!Total) {
            return res.status(400).json({ error: "El valor de 'Total' es necesario en el XML" });
        }

        if (!RFCReceptor) {
            return res.status(400).json({ error: "El RFC del receptor es necesario en el XML" });
        }

        if (!UUID) {
            return res.status(400).json({ error: "El UUID es necesario en el XML" });
        }

        if (!FechaEmision) {
            return res.status(400).json({ error: "La Fecha de Emisión es necesaria en el XML" });
        }

        if (!Tipo) {
            return res.status(400).json({ error: "El Tipo de Comprobante es necesario en el XML" });
        }

        // Insertar en la base de datos con el Tipo de Comprobante
        const query = `INSERT INTO Facturas (ClienteID, Fecha, Total, Subtotal, RFCReceptor, MetodoPago, Estatus, NumeroFactura, RFCEmisor, UUID, FechaEmision, Tipo) 
                        VALUES (@ClienteID, GETDATE(), @Total, @SubTotal, @RFCReceptor, 'Desconocido', 'Pendiente', 'N/A', 'N/A', @UUID, @FechaEmision, @Tipo)`;

        const request = new sql.Request();
        request.input("ClienteID", sql.Int, ClienteID);
        request.input("Total", sql.Decimal, Total);
        request.input("SubTotal", sql.Decimal, SubTotal);
        request.input("RFCReceptor", sql.VarChar, RFCReceptor);
        request.input("UUID", sql.VarChar, UUID);
        request.input("FechaEmision", sql.DateTime, FechaEmision);
        request.input("Tipo", sql.VarChar, Tipo); // "I" o "E"

        await request.query(query);

        res.status(201).json({ mensaje: "Factura registrada exitosamente", Tipo });
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

        const request = new sql.Request();
        request.input("Fecha", sql.Date, Fecha);
        request.input("Total", sql.Decimal, Total);
        request.input("MetodoPago", sql.NVarChar, MetodoPago);
        request.input("Estatus", sql.NVarChar, Estatus);
        request.input("NumeroFactura", sql.NVarChar, NumeroFactura);
        request.input("RFCEmisor", sql.NVarChar, RFCEmisor);
        request.input("EnlacePDF", sql.NVarChar, EnlacePDF);
        request.input("FacturaID", sql.Int, FacturaID);

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

        const request = new sql.Request();
        request.input("FacturaID", sql.Int, FacturaID);

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
    upload,
    actualizarFactura,
    eliminarFactura,
};
