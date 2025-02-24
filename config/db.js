const sql = require('mssql');

const config = {
  user: 'AARON',
  password: 'valentinaikeR-3',
  server: 'localhost', 
  database: 'EbenConta',
  options: {
    encrypt: true, 
    trustServerCertificate: true, 
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
