const { sql } = require('../config/db');

// Obtener todos los clientes de un usuario específico
const getClientes = async (req, res) => {
    const { usuarioID } = req.query; // Filtro por usuario

    try {
        let query = 'SELECT * FROM Clientes'; // Consulta por todos los clientes

        // Si se recibe usuarioID, añade el filtro
        if (usuarioID) {
            query += ` WHERE UsuarioID = ${usuarioID}`;
        }

        const result = await sql.query(query);
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los clientes', details: err.message });
    }
};

// Obtener un cliente por ID
const getClienteById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`
            SELECT * FROM Clientes WHERE ClienteID = ${id}
        `;
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el cliente', details: err.message });
    }
};

// Crear un nuevo cliente
const createCliente = async (req, res) => {
    const { nombre, rfc, correo, telefono, direccion, usuarioID } = req.body;
    try {
        await sql.query`
            INSERT INTO Clientes (Nombre, RFC, Correo, Telefono, Direccion, UsuarioID)
            VALUES (${nombre}, ${rfc}, ${correo}, ${telefono}, ${direccion}, ${usuarioID})
        `;
        res.status(201).json({ message: 'Cliente creado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el cliente', details: err.message });
    }
};

// Actualizar un cliente existente
const updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, rfc, correo, telefono, direccion, usuarioID } = req.body;
    try {
        const result = await sql.query`
            UPDATE Clientes
            SET Nombre = ${nombre}, RFC = ${rfc}, Correo = ${correo}, Telefono = ${telefono}, Direccion = ${direccion}, UsuarioID = ${usuarioID}
            WHERE ClienteID = ${id}
        `;
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json({ message: 'Cliente actualizado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el cliente', details: err.message });
    }
};

// Eliminar un cliente
const deleteCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`
            DELETE FROM Clientes WHERE ClienteID = ${id}
        `;
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el cliente', details: err.message });
    }
};

module.exports = {
    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
};
