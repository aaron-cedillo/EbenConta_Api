const { sql, connectDB } = require('../config/db');
const jwt = require('jsonwebtoken');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    await connectDB(); 
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
    await connectDB(); 

    const result = await sql.query`SELECT * FROM Usuarios WHERE Correo = ${email}`;
    const user = result.recordset[0]; 

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (user.Contrasena !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    if (user.Rol === 'contador') {
      const currentDate = new Date();
      const expirationDate = new Date(user.FechaExpiracion); 

      if (currentDate > expirationDate) {
        return res.status(403).json({ message: 'El acceso de este contador ha expirado' });
      }
    }

    const token = jwt.sign(
      { 
        id: user.UsuarioID, 
        email: user.Correo, 
        rol: user.Rol,
        nombre: user.Nombre 
      },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' } 
    );

    return res.json({ token, rol: user.Rol, nombre: user.Nombre });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

module.exports = { getUsers, loginUser };
