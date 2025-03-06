const { sql } = require('../config/db');

/*/ Obtener todos los clientes del usuario autenticado
exports.getClientes = async (req, res) => {
  const userId = req.user.id;  // El `id` del usuario viene del token JWT

  try {
    // Filtramos los clientes por el `UsuarioID` del usuario autenticado
    const result = await sql.query`
      SELECT ClienteID, Nombre, RFC, Correo, Telefono, Direccion, UsuarioID
      FROM Clientes
      WHERE UsuarioID = ${userId}
    `;
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    res.status(500).json({ message: "Error al obtener los clientes", error: error.message });
  }
};*/

exports.getClientePorID = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await sql.query`
      SELECT Nombre FROM Clientes WHERE ClienteID = ${id}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.status(200).json(result.recordset[0]); // Devuelve solo el nombre del cliente
  } catch (error) {
    console.error("Error al obtener el cliente:", error);
    res.status(500).json({ message: "Error al obtener el cliente", error: error.message });
  }
};

exports.getClientesArchivados = async (req, res) => {
  const usuarioId = req.user.id;

  try {
    const result = await sql.query`
      SELECT ClienteID, Nombre, RFC, Correo, Telefono, Direccion, UsuarioID
      FROM Clientes
      WHERE UsuarioID = ${usuarioId} AND Archivado = 1
    `;
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener clientes archivados:", error);
    res.status(500).json({ message: "Error al obtener clientes archivados", error: error.message });
  }
};

exports.restaurarCliente = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.user.id;

  try {
    const cliente = await sql.query`
      SELECT UsuarioID FROM Clientes WHERE ClienteID = ${id}
    `;

    if (cliente.recordset.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    if (cliente.recordset[0].UsuarioID !== usuarioId) {
      return res.status(403).json({ message: "No tienes permiso para restaurar este cliente" });
    }

    await sql.query`
      UPDATE Clientes SET Archivado = 0 WHERE ClienteID = ${id}
    `;

    res.status(200).json({ message: "Cliente restaurado correctamente" });
  } catch (error) {
    console.error("Error al restaurar cliente:", error);
    res.status(500).json({ message: "Error al restaurar cliente", error: error.message });
  }
};

exports.getClientes = async (req, res) => {
  const userId = req.user.id; // ID del usuario autenticado

  try {
    // Filtramos solo los clientes NO archivados
    const result = await sql.query`
      SELECT ClienteID, Nombre, RFC, Correo, Telefono, Direccion, UsuarioID
      FROM Clientes
      WHERE UsuarioID = ${userId} AND Archivado = 0
    `;
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    res.status(500).json({ message: "Error al obtener los clientes", error: error.message });
  }
};

// Agregar un nuevo cliente
exports.addCliente = async (req, res) => {
  const { nombre, rfc, correo, telefono, direccion } = req.body;
  const usuarioId = req.user.id;  // Usamos el UsuarioID del usuario autenticado
  
  // Validación básica
  if (!nombre || !rfc || !correo || !telefono || !direccion) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  try {
    // Insertamos el cliente con el `UsuarioID` del usuario autenticado
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
  const usuarioId = req.user.id;  // Usamos el `UsuarioID` del usuario autenticado

  // Validamos que al menos uno de los campos sea proporcionado
  if (!nombre && !rfc && !correo && !telefono && !direccion) {
    return res.status(400).json({ message: "Debe proporcionar al menos un dato para actualizar" });
  }

  try {
    // Verificamos si el cliente pertenece al usuario autenticado
    const cliente = await sql.query`
      SELECT UsuarioID FROM Clientes WHERE ClienteID = ${id}
    `;
    
    if (cliente.recordset.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    if (cliente.recordset[0].UsuarioID !== usuarioId) {
      return res.status(403).json({ message: "No tienes permiso para editar este cliente" });
    }

    let updateQuery = 'UPDATE Clientes SET ';
    const updateParams = [];

    if (nombre) {
      updateQuery += `Nombre = @nombre, `;
      updateParams.push({ name: 'nombre', type: sql.NVarChar, value: nombre });
    }
    if (rfc) {
      updateQuery += `RFC = @rfc, `;
      updateParams.push({ name: 'rfc', type: sql.NVarChar, value: rfc });
    }
    if (correo) {
      updateQuery += `Correo = @correo, `;
      updateParams.push({ name: 'correo', type: sql.NVarChar, value: correo });
    }
    if (telefono) {
      updateQuery += `Telefono = @telefono, `;
      updateParams.push({ name: 'telefono', type: sql.NVarChar, value: telefono });
    }
    if (direccion) {
      updateQuery += `Direccion = @direccion, `;
      updateParams.push({ name: 'direccion', type: sql.NVarChar, value: direccion });
    }

    // Si no se proporcionaron datos para actualizar
    if (updateQuery.endsWith('SET ')) {
      return res.status(400).json({ message: "No se proporcionaron datos para actualizar" });
    }

    // Quitamos la coma final y completamos la cláusula WHERE
    updateQuery = updateQuery.slice(0, -2);
    updateQuery += ` WHERE ClienteID = @id`;

    updateParams.push({ name: 'id', type: sql.Int, value: id });

    const request = new sql.Request();
    
    // Agregamos los parámetros
    updateParams.forEach(param => {
      request.input(param.name, param.type, param.value);
    });

    // Ejecutamos la consulta con los parámetros
    await request.query(updateQuery);

    res.status(200).json({ message: 'Cliente actualizado correctamente' });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error al actualizar cliente", error: error.message });
  }
};

/*/ Eliminar un cliente
exports.deleteCliente = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.user.id;  // Usamos el `UsuarioID` del usuario autenticado

  try {
    // Verificamos si el cliente pertenece al usuario autenticado
    const cliente = await sql.query`
      SELECT UsuarioID FROM Clientes WHERE ClienteID = ${id}
    `;
    
    if (cliente.recordset.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    if (cliente.recordset[0].UsuarioID !== usuarioId) {
      return res.status(403).json({ message: "No tienes permiso para eliminar este cliente" });
    }

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
};*/

// Archivar un cliente (sin eliminarlo)
exports.archivarCliente = async (req, res) => {
  const { id } = req.params;
  const usuarioId = req.user.id; // Usuario autenticado

  try {
    // Verificar si el cliente pertenece al usuario autenticado
    const cliente = await sql.query`
      SELECT UsuarioID FROM Clientes WHERE ClienteID = ${id}
    `;

    if (cliente.recordset.length === 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    if (cliente.recordset[0].UsuarioID !== usuarioId) {
      return res.status(403).json({ message: "No tienes permiso para archivar este cliente" });
    }

    // Marcar el cliente como archivado
    await sql.query`
      UPDATE Clientes
      SET Archivado = 1
      WHERE ClienteID = ${id}
    `;

    res.status(200).json({ message: "Cliente archivado correctamente" });
  } catch (error) {
    console.error("Error al archivar cliente:", error);
    res.status(500).json({ message: "Error al archivar cliente", error: error.message });
  }
};

