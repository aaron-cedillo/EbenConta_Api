const sql = require('mssql');

const config = {
  user: 'AARON',
  password: 'valentinaikeR-3',
  server: 'localhost', // O tu servidor de base de datos
  database: 'EbenConta',
  options: {
    encrypt: true, // Si usas Azure, o si es necesario para tu conexión
    trustServerCertificate: true, // Para evitar problemas con certificados no confiables
  },
};

// Conectar a la base de datos
const connectDB = async () => {
  try {
    await sql.connect(config);  // Establece la conexión con la base de datos
    console.log('Conexión exitosa a la base de datos');
  } catch (err) {
    console.error('Error de conexión: ', err);
  }
};

// Exporta el objeto sql y la función connectDB
module.exports = { sql, connectDB };
