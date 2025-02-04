const express = require('express');
const cors = require('cors');  // Importa el paquete cors
const app = express();
const port = 3001;

// Importar las rutas
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/userRoutes');
const clienteRoutes = require('./routes/clienteRoutes');

// Middleware
app.use(express.json());

// Habilitar CORS para todas las rutas
app.use(cors()); // Esto habilita CORS para todas las rutas y orígenes

// Conectar a la base de datos
const { connectDB } = require('./config/db');
connectDB(); // Establecer la conexión a la base de datos

// Ruta raíz (opcional)
app.get('/', (req, res) => {
    res.send('Bienvenido a la API');
});

// Rutas
app.use('/api', indexRoutes); // Rutas del índice con prefijo '/api'
app.use('/api/users', userRoutes); // Rutas de usuarios con prefijo '/api/users'
app.use('/api/clientes', clienteRoutes); // Rutas de clientes con prefijo '/api/clientes'

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
