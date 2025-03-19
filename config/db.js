const sql = require('mssql');

const config = {
  user: 'Tu_usuario',
  password: 'Tu_contraseña',
  server: 'localhost', 
  database: 'EbenConta',
  options: {
    encrypt: true, 
    trustServerCertificate: true, 
  },
};

const connectDB = async () => {
  try {
    await sql.connect(config);  
    console.log('Conexión exitosa a la base de datos');
  } catch (err) {
    console.error('Error de conexión: ', err);
  }
};

module.exports = { sql, connectDB };
