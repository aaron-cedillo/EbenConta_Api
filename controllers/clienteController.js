const db = require('../config/db'); 

// Listar clientes de un contador
const getClientes = async (req, res) => {
  try {
    const { userId } = req.params; // El ID del contador se pasa como parámetro
    const clientes = await Cliente.find({ UsuarioID: userId });
    res.json(clientes);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

// Agregar un cliente
const addCliente = async (req, res) => {
  try {
    const { nombre, rfc, correo, telefono, direccion, usuarioId } = req.body;
    const nuevoCliente = new Cliente({
      Nombre: nombre,
      RFC: rfc,
      Correo: correo,
      Telefono: telefono,
      Direccion: direccion,
      UsuarioID: usuarioId, // Relación con el contador
    });

    await nuevoCliente.save();
    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error("Error al agregar cliente:", error);
    res.status(500).json({ message: "Error al agregar cliente" });
  }
};

// Editar un cliente
const editCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const { nombre, rfc, correo, telefono, direccion } = req.body;

    const cliente = await Cliente.findByIdAndUpdate(clienteId, {
      Nombre: nombre,
      RFC: rfc,
      Correo: correo,
      Telefono: telefono,
      Direccion: direccion,
    }, { new: true });

    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.json(cliente);
  } catch (error) {
    console.error("Error al editar cliente:", error);
    res.status(500).json({ message: "Error al editar cliente" });
  }
};

// Eliminar un cliente
const deleteCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    const cliente = await Cliente.findByIdAndDelete(clienteId);

    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.json({ message: "Cliente eliminado" });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ message: "Error al eliminar cliente" });
  }
};

module.exports = { getClientes, addCliente, editCliente, deleteCliente };
