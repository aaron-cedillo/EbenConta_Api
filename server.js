require('dotenv').config(); // Cargar las variables de entorno

const express = require('express');
const cors = require('cors'); 
const app = express();
const port = 3001;

// Importar las rutas
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contadorRoutes = require('./routes/contadorRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const clienteDashboardRoutes = require('./routes/clienteDashboardRoutes');
const facturaRoutes = require("./routes/facturaRoutes");
const ingresosegresosRoutes = require("./routes/ingresosegresosRoutes");
const alertasRoutes = require("./routes/alertasRoutes");
const contadorEstadisticasRoutes = require("./routes/contadorEstadisticasRoutes");

// Middleware
app.use(express.json());

// Habilitar CORS para todas las rutas
app.use(cors()); // Esto habilita CORS para todas las rutas y orígenes

// Conectar a la base de datos
const { connectDB } = require('./config/db');
connectDB(); // Establecer la conexión a la base de datos

// Ruta raíz 
app.get('/', (req, res) => {
    res.send('Bienvenido a la API');
});

// Rutas
app.use('/api/users', userRoutes); // Rutas de usuarios con prefijo '/api/users'
app.use('/api/admin', adminRoutes); // Rutas de administración con prefijo '/api/admin'
app.use('/api/contador', contadorRoutes); // Rutas de contadores con prefijo '/api/contador'
app.use('/api/clientes', clienteRoutes); // Rutas de clientes
app.use('/api', clienteDashboardRoutes);  // Rutas de ClienteDashboard
app.use("/api/facturas", facturaRoutes);  // Rutas de facturas
app.use("/api/facturas", ingresosegresosRoutes);  // Rutas de resumen de facturas
app.use("/api/alertas", alertasRoutes); // Rutas de alertas
app.use("/api/estadisticas", contadorEstadisticasRoutes); // Rutas de estadísticas

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
