const { sql } = require("../config/db");  // Usamos sql desde la configuración de la base de datos
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const xml2js = require('xml2js');

const procesarXML = (rutaArchivo) => {
    const xml = fs.readFileSync(rutaArchivo, 'utf-8');  // Lee el archivo XML
    let jsonData = null;

    xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
        if (err) throw new Error("Error al procesar el XML");
        jsonData = result;
    });

    return jsonData;
};

// Configuración de multer para guardar los archivos en "uploads/xml"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../uploads/xml");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // Crea la carpeta si no existe
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Renombra el archivo
    },
});

// Filtro para aceptar solo archivos XML
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "text/xml" || file.mimetype === "application/xml") {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten archivos XML"), false);
    }
};

// Middleware de subida de archivos
const upload = multer({ storage, fileFilter });

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

        // Validar que FacturaID sea un número válido
        const facturaIDInt = parseInt(FacturaID, 10);
        if (isNaN(facturaIDInt)) {
            return res.status(400).json({ error: "FacturaID debe ser un número válido" });
        }

        const query = `SELECT * FROM Facturas WHERE FacturaID = @FacturaID`;

        // Declaramos el parámetro FacturaID
        const request = new sql.Request();
        request.input('FacturaID', sql.Int, facturaIDInt); // Usamos la versión convertida a número entero

        // Ejecutamos la consulta
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
        const { ClienteID } = req.body;  // Puedes seguir utilizando req.body para el ClienteID
        const xmlFile = req.file; // Esto accede al archivo XML subido

        if (!xmlFile) {
            return res.status(400).json({ error: "No se ha subido un archivo XML" });
        }

        const rutaXML = xmlFile.path;
        const datosXML = procesarXML(rutaXML); // Usar la función procesarXML para obtener los datos del XML

        // Extraemos el valor del Total desde el XML
        const Total = datosXML['cfdi:Comprobante'].Total;

        if (!Total) {
            return res.status(400).json({ error: "El valor de 'Total' es necesario" });
        }

        // Extraemos otros detalles del XML, si es necesario
        const { Fecha, MetodoPago, Estatus, NumeroFactura, RFCEmisor } = req.body;

        const query = `INSERT INTO Facturas (ClienteID, Fecha, Total, MetodoPago, Estatus, NumeroFactura, RFCEmisor, EnlaceXML) 
                       VALUES (@ClienteID, @Fecha, @Total, @MetodoPago, @Estatus, @NumeroFactura, @RFCEmisor, @EnlaceXML)`;

        const request = new sql.Request();
        request.input('ClienteID', sql.Int, ClienteID);
        request.input('Fecha', sql.Date, Fecha);
        request.input('Total', sql.Decimal, Total);
        request.input('MetodoPago', sql.NVarChar, MetodoPago);
        request.input('Estatus', sql.NVarChar, Estatus);
        request.input('NumeroFactura', sql.NVarChar, NumeroFactura);
        request.input('RFCEmisor', sql.NVarChar, RFCEmisor);
        request.input('EnlaceXML', sql.NVarChar, rutaXML); // Guarda la ruta del archivo XML

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
    upload,
    actualizarFactura,
    eliminarFactura,
};
