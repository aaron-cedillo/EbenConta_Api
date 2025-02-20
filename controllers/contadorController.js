const db = require('../config/db'); 
const { validationResult } = require('express-validator');

// Obtener el perfil de un contador
const getContadorProfile = async (req, res) => {
  const { contadorId } = req.params;
  try {
    const query = 'SELECT * FROM contadores WHERE UsuarioID = ?';
    db.query(query, [contadorId], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error al obtener los datos del contador' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Contador no encontrado' });
      }
      res.status(200).json(results[0]);
    });
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
    const query = 'UPDATE contadores SET Nombre = ?, Correo = ?, FechaExpiracion = ? WHERE UsuarioID = ?';
    db.query(query, [nombre, correo, fechaExpiracion, contadorId], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error al actualizar el contador' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Contador no encontrado' });
      }
      res.status(200).json({ message: 'Contador actualizado exitosamente' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Función para cambiar la contraseña del contador (si es necesario)
const changeContadorPassword = async (req, res) => {
  const { contadorId } = req.params;
  const { nuevaContrasena } = req.body;

  try {
    const query = 'UPDATE contadores SET Contrasena = ? WHERE UsuarioID = ?';
    db.query(query, [nuevaContrasena, contadorId], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error al cambiar la contraseña' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Contador no encontrado' });
      }
      res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    });
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
