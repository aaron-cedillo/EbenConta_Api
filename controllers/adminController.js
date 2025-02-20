const { sql } = require('../config/db');

// Registrar un contador
const registrarContador = async (req, res) => {
  const { nombre, correo, contrasena, fechaExpiracion } = req.body;

  try {
    await sql.query`
      INSERT INTO Usuarios (Nombre, Correo, Contrasena, Rol, FechaExpiracion)
      VALUES (${nombre}, ${correo}, ${contrasena}, 'contador', ${fechaExpiracion});
    `;

    res.status(201).json({ message: 'Contador registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el contador:', error);
    res.status(500).json({ message: 'Error al registrar el contador', error: error.message });
  }
};

// Obtener todos los contadores registrados
const obtenerContadores = async (req, res) => {
  try {
    const result = await sql.query`SELECT UsuarioID, Nombre, Correo, FechaExpiracion FROM Usuarios WHERE Rol = 'contador'`;
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener los contadores:', error);
    res.status(500).json({ message: 'Error al obtener los contadores' });
  }
};

// Editar los datos de un contador
const editarContador = async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, contrasena, fechaExpiracion } = req.body;

  try {
    let updateQuery = 'UPDATE Usuarios SET ';
    let updateValues = [];

    if (nombre) {
      updateQuery += `Nombre = '${nombre}', `;
    }
    if (correo) {
      updateQuery += `Correo = '${correo}', `;
    }
    if (contrasena !== undefined) {
      updateQuery += `Contrasena = '${contrasena}', `;
    }
    if (fechaExpiracion) {
      updateQuery += `FechaExpiracion = '${fechaExpiracion}', `;
    }

    if (updateQuery.endsWith('SET ')) {
      return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
    }

    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ` WHERE UsuarioID = ${id} AND Rol = 'contador'`;

    await sql.query(updateQuery);

    res.json({ message: 'Contador actualizado exitosamente' });
  } catch (error) {
    console.error('Error al editar el contador:', error);
    res.status(500).json({ message: 'Error al editar el contador', error: error.message });
  }
};

// Eliminar un contador
const eliminarContador = async (req, res) => {
  const { id } = req.params;

  try {
    await sql.query`DELETE FROM Usuarios WHERE UsuarioID = ${id} AND Rol = 'contador'`;
    res.json({ message: 'Contador eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el contador:', error);
    res.status(500).json({ message: 'Error al eliminar el contador', error: error.message });
  }
};

module.exports = { registrarContador, obtenerContadores, editarContador, eliminarContador };
