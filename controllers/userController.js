const { sql, connectDB } = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    await connectDB();
    const result = await sql.query`SELECT UsuarioID, Nombre, Correo, Rol, FechaRegistro, FechaExpiracion FROM Usuarios`;
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

    const isMatch = await bcrypt.compare(password, user.Contrasena);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    if (user.Rol === 'contador') {
      const currentDate = new Date();
      const expirationDate = new Date(user.FechaExpiracion);

      if (currentDate > expirationDate) {
        return res.status(403).json({ message: 'El acceso de este contador ha expirado' });
      }
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.UsuarioID,
        email: user.Correo,
        rol: user.Rol,
        nombre: user.Nombre,
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

// Renovar Token JWT si el usuario está activo
const renewToken = async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No hay token proporcionado" });
  }

  try {
    // Verificar el token actual
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Generar un nuevo token con 1 hora más de validez
    const newToken = jwt.sign(
      { 
        id: decoded.id, 
        email: decoded.email, 
        rol: decoded.rol, 
        nombre: decoded.nombre 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } 
    );

    return res.json({ token: newToken });

  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = { getUsers, loginUser, renewToken };
