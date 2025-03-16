const { sql, connectDB } = require("../config/db");

const obtenerTotalClientes = async (req, res) => {
  try {
    console.log("🔍 Datos del usuario autenticado:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "Usuario no identificado" });
    }

    const usuarioID = req.user.id;

    // Conectar a la base de datos
    await connectDB();

    // Crear una nueva instancia de Request
    const request = new sql.Request();
    request.input("UsuarioID", sql.Int, usuarioID);

    const result = await request.query("SELECT COUNT(*) AS total FROM Clientes WHERE UsuarioID = @UsuarioID");

    res.json({ total: result.recordset[0].total });
  } catch (error) {
    console.error("❌ Error al obtener el total de clientes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const obtenerTotalFacturas = async (req, res) => {
  try {
    console.log("🔍 Datos del usuario autenticado:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "Usuario no identificado" });
    }

    const usuarioID = req.user.id;

    // Conectar a la base de datos
    await connectDB();

    // Crear una nueva instancia de Request
    const request = new sql.Request();
    request.input("UsuarioID", sql.Int, usuarioID);

    const result = await request.query(`
      SELECT COUNT(*) AS total 
      FROM Facturas 
      WHERE ClienteID IN (SELECT ClienteID FROM Clientes WHERE UsuarioID = @UsuarioID)
    `);

    res.json({ total: result.recordset[0].total });
  } catch (error) {
    console.error("❌ Error al obtener el total de facturas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = { obtenerTotalClientes, obtenerTotalFacturas };
