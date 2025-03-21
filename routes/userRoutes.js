const express = require('express');
const { loginUser, getUsers, renewToken } = require('../controllers/userController');
const { sql, connectDB } = require('../config/db'); 
const router = express.Router();

// Ruta para registrar un contador
router.post('/register', async (req, res) => {
  const { nombre, correo, contrasena, fechaExpiracion, rol } = req.body;

  try {
    await connectDB();
    await sql.query`INSERT INTO Usuarios (Nombre, Correo, Contrasena, FechaExpiracion, Rol)
                    VALUES (${nombre}, ${correo}, ${contrasena}, ${fechaExpiracion}, ${rol})`;
    res.status(201).json({ message: 'Contador registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar contador:', error);
    res.status(500).json({ message: 'Error al registrar contador', error: error.message });
  }
});

// Rutas para login y obtener usuarios
router.post('/login', loginUser);
router.get('/', getUsers); 

// Ruta para renovar el token
router.post("/renew-token", renewToken);

module.exports = router;
