const { sql } = require("../config/db");

// Crear una nueva alerta
exports.crearAlerta = async (req, res) => {
    const { Tipo, FechaVencimiento, Estado, NombreClientes } = req.body;
    const usuarioId = req.user.id;  // Usuario autenticado

    if (!Tipo || !FechaVencimiento || !Estado || !NombreClientes) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Insertar la alerta en la tabla
        await sql.query`
      INSERT INTO Alertas (Tipo, FechaVencimiento, Estado, NombreClientes, UsuarioID)
      VALUES (${Tipo}, ${FechaVencimiento}, ${Estado}, ${NombreClientes}, ${usuarioId})
    `;

        res.status(201).json({ message: 'Alerta agregada correctamente' });
    } catch (error) {
        console.error('Error al agregar alerta:', error);
        res.status(500).json({ error: 'Error al agregar la alerta' });
    }
};

// Obtener todas las alertas del usuario autenticado
exports.obtenerAlertas = async (req, res) => {
    const usuarioId = req.user.id;  // Usuario autenticado

    try {
        const result = await sql.query`
      SELECT AlertaID, Tipo, FechaVencimiento, Estado, NombreClientes
      FROM Alertas
      WHERE UsuarioID = ${usuarioId}  -- Filtrar por el usuario autenticado
    `;

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error al obtener alertas:', error);
        res.status(500).json({ message: 'Error al obtener alertas', error: error.message });
    }
};

// Actualizar el estado de una alerta (Pendiente / Atendida)
exports.actualizarEstadoAlerta = async (req, res) => {
    const { id } = req.params;  // ID de la alerta
    const { Estado } = req.body;  // Nuevo estado (Pendiente / Atendida)
    const usuarioId = req.user.id;  // Usuario autenticado

    if (!Estado) {
        return res.status(400).json({ error: 'El estado es obligatorio' });
    }

    try {
        // Verificar si la alerta pertenece al usuario autenticado
        const result = await sql.query`
      SELECT AlertaID
      FROM Alertas
      WHERE AlertaID = ${id} AND UsuarioID = ${usuarioId}
    `;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Alerta no encontrada o no tienes permiso para editarla' });
        }

        // Actualizar el estado de la alerta
        await sql.query`
      UPDATE Alertas
      SET Estado = ${Estado}
      WHERE AlertaID = ${id} AND UsuarioID = ${usuarioId}
    `;

        res.status(200).json({ message: 'Estado de la alerta actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar alerta:', error);
        res.status(500).json({ message: 'Error al actualizar alerta', error: error.message });
    }
};

// Eliminar una alerta
exports.eliminarAlerta = async (req, res) => {
    const { id } = req.params;  // ID de la alerta
    const usuarioId = req.user.id;  // Usuario autenticado

    try {
        // Verificar si la alerta pertenece al usuario autenticado
        const result = await sql.query`
        SELECT AlertaID
        FROM Alertas
        WHERE AlertaID = ${id} AND UsuarioID = ${usuarioId}
      `;

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Alerta no encontrada o no tienes permiso para eliminarla' });
        }

        // Eliminar la alerta
        await sql.query`
        DELETE FROM Alertas WHERE AlertaID = ${id} AND UsuarioID = ${usuarioId}
      `;

        res.status(200).json({ message: 'Alerta eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar alerta:', error);
        res.status(500).json({ message: 'Error al eliminar alerta', error: error.message });
    }
};


