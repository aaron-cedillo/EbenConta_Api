const { sql } = require('../config/db');

// Obtener todos los clientes
exports.getClientes = async (req, res) => {
  try {
    const result = await sql.query`
      SELECT ClienteID, Nombre, RFC, Correo, Telefono, Direccion, UsuarioID
      FROM Clientes
    `;
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    res.status(500).json({ message: "Error al obtener los clientes", error: error.message });
  }
};

// Agregar un nuevo cliente
exports.addCliente = async (req, res) => {
  const { nombre, rfc, correo, telefono, direccion, usuarioId } = req.body;
  
  // Validación básica
  if (!nombre || !rfc || !correo || !telefono || !direccion || !usuarioId) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    await sql.query`
      INSERT INTO Clientes (Nombre, RFC, Correo, Telefono, Direccion, UsuarioID) 
      VALUES (${nombre}, ${rfc}, ${correo}, ${telefono}, ${direccion}, ${usuarioId})
    `;
    res.status(201).json({ message: 'Cliente agregado correctamente' });
  } catch (error) {
    console.error("Error al agregar cliente:", error);
    res.status(500).json({ message: "Error al agregar cliente", error: error.message });
  }
};

// Editar un cliente
exports.updateCliente = async (req, res) => {
  const { id } = req.params;  // Tomamos el id desde los parámetros de la URL
  const { nombre, rfc, correo, telefono, direccion } = req.body;  // Tomamos los datos desde el body
  
  // Validamos que al menos uno de los campos sea proporcionado
  if (!nombre && !rfc && !correo && !telefono && !direccion) {
    return res.status(400).json({ message: "Debe proporcionar al menos un dato para actualizar" });
  }

  try {
    let updateQuery = 'UPDATE Clientes SET ';
    let updateValues = [];

    if (nombre) {
      updateQuery += `Nombre = ${nombre}, `;
    }
    if (rfc) {
      updateQuery += `RFC = ${rfc}, `;
    }
    if (correo) {
      updateQuery += `Correo = ${correo}, `;
    }
    if (telefono) {
      updateQuery += `Telefono = ${telefono}, `;
    }
    if (direccion) {
      updateQuery += `Direccion = ${direccion}, `;
    }

    // Si no se proporcionaron datos para actualizar
    if (updateQuery.endsWith('SET ')) {
      return res.status(400).json({ message: "No se proporcionaron datos para actualizar" });
    }

    // Quitamos la coma final y completamos la cláusula WHERE
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ` WHERE ClienteID = ${id}`;

    await sql.query(updateQuery);

    res.status(200).json({ message: 'Cliente actualizado correctamente' });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error al actualizar cliente", error: error.message });
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
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ message: "Error al eliminar cliente", error: error.message });
  }
};
