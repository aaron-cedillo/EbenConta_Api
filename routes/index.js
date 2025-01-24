const express = require('express');
const router = express.Router();
const { connectDB, sql } = require('../config/db');

// Ruta para obtener todos los registros de una tabla
router.get('/data', async (req, res) => {
  try {
    await connectDB(); // Conectar a la base de datos

    // Realizar la consulta a la base de datos
    const result = await sql.query`SELECT * FROM Usuarios`; // Asegúrate de que sea el nombre correcto de la tabla

    // Devolver los datos como respuesta
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al realizar la consulta: ', err);
    res.status(500).send('Error en la base de datos');
  }
});

module.exports = router;