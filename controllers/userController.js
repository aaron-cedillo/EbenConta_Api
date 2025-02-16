const { sql, connectDB } = require('../config/db');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
  try {
    await connectDB(); // Conectar a la BD
    const result = await sql.query`SELECT * FROM Usuarios`;
    res.json(result.recordset);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Controlador para el login de usuario
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    await connectDB(); // Conectar a la base de datos

    // Buscar al usuario por correo
    const result = await sql.query`SELECT * FROM Usuarios WHERE Correo = ${email}`;
    const user = result.recordset[0]; // Suponemos que solo hay un usuario con ese correo

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña en texto plano (sin hashing)
    if (user.Contrasena !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: user.UsuarioID, email: user.Correo, role: user.Rol },
      'SECRET_KEY', // Asegúrate de usar una clave secreta segura
      { expiresIn: '1h' } // El token expira en 1 hora
    );

    // Retornar el token en la respuesta
    res.json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

module.exports = { getUsers, loginUser };
