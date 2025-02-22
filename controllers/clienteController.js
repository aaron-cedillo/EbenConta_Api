// API/controllers/clienteController.js
const { sql } = require('../config/db');

// Obtener todos los clientes
exports.getClientes = async (req, res) => {
  try {
    const result = await sql.query`SELECT ClienteID, Nombre, RFC, Correo, Telefono, Direccion, UsuarioID FROM Clientes`;
    res.status(200).json(result.recordset); // En SQL Server usamos recordset para obtener los resultados
  } catch (error) {
    console.error("Error al obtener los clientes", error);
    res.status(500).json({ message: "Error al obtener los clientes", error });
  }
};

// Agregar un nuevo cliente
exports.addCliente = async (req, res) => {
  const { nombre, rfc, correo, telefono, direccion, usuarioId } = req.body;
  try {
    const result = await sql.query`
      INSERT INTO Clientes (Nombre, RFC, Correo, Telefono, Direccion, UsuarioID) 
      VALUES (${nombre}, ${rfc}, ${correo}, ${telefono}, ${direccion}, ${usuarioId})
    `;
    res.status(201).json({ message: 'Cliente agregado correctamente' });
  } catch (error) {
    console.error("Error al agregar cliente", error);
    res.status(500).json({ message: "Error al agregar cliente", error });
  }
};

// Editar un cliente
exports.updateCliente = async (req, res) => {
  const { id } = req.params;
  const { nombre, rfc, correo, telefono, direccion } = req.body;
  try {
    const result = await sql.query`
      UPDATE Clientes
      SET Nombre = ${nombre}, RFC = ${rfc}, Correo = ${correo}, Telefono = ${telefono}, Direccion = ${direccion}
      WHERE ClienteID = ${id}
    `;
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json({ message: 'Cliente actualizado correctamente' });
  } catch (error) {
    console.error("Error al actualizar cliente", error);
    res.status(500).json({ message: "Error al actualizar cliente", error });
  }
};

// Eliminar un cliente
exports.deleteCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql.query`
      DELETE FROM Clientes WHERE ClienteID = ${id}
    `;
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar cliente", error);
    res.status(500).json({ message: "Error al eliminar cliente", error });
  }
};

// Buscar clientes
exports.searchClientes = async (req, res) => {
  const { search } = req.query; // Buscar por nombre o RFC
  try {
    const result = await sql.query`
      SELECT ClienteID, Nombre, RFC, Correo, Telefono, Direccion, UsuarioID
      FROM Clientes
      WHERE Nombre LIKE '%' + ${search} + '%' OR RFC LIKE '%' + ${search} + '%'
    `;
    res.status(200).json(result.recordset); // Devuelve los resultados encontrados
  } catch (error) {
    console.error("Error al buscar clientes", error);
    res.status(500).json({ message: "Error al buscar clientes", error });
  }
};
