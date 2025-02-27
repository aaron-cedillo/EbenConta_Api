const { sql } = require('../config/db');

// Obtener un solo cliente por su ClienteID
exports.getClienteById = async (req, res) => {
  const { id } = req.params;  // ID del cliente desde la URL
  const usuarioId = req.user.id;  // ID del usuario autenticado desde el token

  try {
    const result = await sql.query`
      SELECT ClienteID, Nombre, RFC, Correo, Telefono, Direccion, UsuarioID
      FROM Clientes
      WHERE ClienteID = ${id} AND UsuarioID = ${usuarioId} -- Para asegurar que solo ve sus clientes
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({ message: "Error al obtener cliente", error: error.message });
  }
};


