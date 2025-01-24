const { sql, connectDB } = require('../config/db');

// Controlador para obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    await connectDB(); // Asegúrate de que estamos conectados antes de ejecutar la consulta
    const result = await sql.query('SELECT * FROM Usuarios'); // Realiza la consulta después de la conexión
    res.json(result.recordset); // Retorna los usuarios como JSON
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).send('Error al obtener usuarios');
  }
};

module.exports = { getUsers };
