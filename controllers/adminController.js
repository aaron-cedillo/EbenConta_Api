const { sql } = require('../config/db');

// Registrar un contador
const registrarContador = async (req, res) => {
  const { nombre, correo, contrasena, fechaExpiracion } = req.body;

  try {
    // Insertar el nuevo contador en la base de datos
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
    let valueCount = 1;

    // Solo añadimos un campo a la consulta si tiene un valor
    if (nombre) {
      updateQuery += `Nombre = @nombre, `;
      updateValues.push({ name: 'nombre', type: sql.VarChar, value: nombre });
    }

    if (correo) {
      updateQuery += `Correo = @correo, `;
      updateValues.push({ name: 'correo', type: sql.VarChar, value: correo });
    }

    // Si se proporciona la contraseña, actualízala
    if (contrasena !== undefined) {
      updateQuery += `Contrasena = @contrasena, `;
      updateValues.push({ name: 'contrasena', type: sql.VarChar, value: contrasena });
    }

    if (fechaExpiracion) {
      updateQuery += `FechaExpiracion = @fechaExpiracion, `;
      updateValues.push({ name: 'fechaExpiracion', type: sql.Date, value: fechaExpiracion });
    }

    // Si no se proporcionó ningún valor para actualizar
    if (updateValues.length === 0) {
      return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
    }

    // Eliminar la última coma extra de la consulta
    updateQuery = updateQuery.slice(0, -2);

    // Agregar la condición WHERE para actualizar solo el contador correcto
    updateQuery += ` WHERE UsuarioID = @id AND Rol = 'contador'`;

    // Añadir el id a los parámetros de la consulta
    updateValues.push({ name: 'id', type: sql.Int, value: id });

    // Ejecutar la consulta de actualización
    await sql.query({
      text: updateQuery,
      parameters: updateValues,
    });

    res.json({ message: 'Contador actualizado exitosamente' });
  } catch (error) {
    console.error('Error al editar el contador:', error);
    res.status(500).json({ message: 'Error al editar el contador', error: error.message });
  }
};

module.exports = { registrarContador, obtenerContadores, editarContador };
