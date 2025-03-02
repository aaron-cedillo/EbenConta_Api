const { sql } = require('../config/db');
const { validationResult } = require('express-validator');

// Obtener el perfil de un contador
const getContadorProfile = async (req, res) => {
  const { contadorId } = req.params;
  try {
    const result = await sql.query`
      SELECT UsuarioID, Nombre, Correo, FechaExpiracion
      FROM Usuarios
      WHERE UsuarioID = ${contadorId} AND Rol = 'contador'
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Contador no encontrado' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar los datos del contador
const updateContador = async (req, res) => {
  const { contadorId } = req.params;
  const { nombre, correo, fechaExpiracion } = req.body;

  // Validación de los datos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const result = await sql.query`
      UPDATE Usuarios
      SET Nombre = ${nombre}, Correo = ${correo}, FechaExpiracion = ${fechaExpiracion}
      WHERE UsuarioID = ${contadorId} AND Rol = 'contador'
    `;

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Contador no encontrado' });
    }

    res.status(200).json({ message: 'Contador actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Cambiar la contraseña del contador (en texto plano)
const changeContadorPassword = async (req, res) => {
  const { contadorId } = req.params;
  const { nuevaContrasena } = req.body;

  try {
    const result = await sql.query`
      UPDATE Usuarios
      SET Contrasena = ${nuevaContrasena}
      WHERE UsuarioID = ${contadorId} AND Rol = 'contador'
    `;

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Contador no encontrado' });
    }

    res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  getContadorProfile,
  updateContador,
  changeContadorPassword,
};
