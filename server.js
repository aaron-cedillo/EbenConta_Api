const express = require('express');
const app = express();
const port = 3001;

// Importar las rutas
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/userRoutes');
const clienteRoutes = require('./routes/clienteRoutes'); // Nueva ruta

// Middleware
app.use(express.json());

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
