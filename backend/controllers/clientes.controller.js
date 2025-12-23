const pool = require('../database/db');

// Obtener todos los clientes
const obtenerClientes = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM clientes WHERE estado = true ORDER BY nombre_cliente'
        );
        
        res.json({
            success: true,
            clientes: result.rows
        });
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener clientes' 
        });
    }
};

// Obtener cliente por ID
const obtenerClientePorId = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(
            'SELECT * FROM clientes WHERE id_cliente = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Cliente no encontrado' 
            });
        }
        
        res.json({
            success: true,
            cliente: result.rows[0]
        });
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener cliente' 
        });
    }
};

// Crear cliente
const crearCliente = async (req, res) => {
    const { cedula, nombre_cliente, telefono, email, direccion } = req.body;
    
    try {
        if (!nombre_cliente) {
            return res.status(400).json({ 
                success: false,
                message: 'El nombre del cliente es requerido' 
            });
        }
        
        const result = await pool.query(
            `INSERT INTO clientes (cedula, nombre_cliente, telefono, email, direccion) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [cedula, nombre_cliente, telefono, email, direccion]
        );
        
        res.status(201).json({
            success: true,
            message: 'Cliente creado exitosamente',
            cliente: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear cliente:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al crear cliente' 
        });
    }
};

// Actualizar cliente
const actualizarCliente = async (req, res) => {
    const { id } = req.params;
    const { cedula, nombre_cliente, telefono, email, direccion } = req.body;
    
    try {
        const result = await pool.query(
            `UPDATE clientes 
             SET cedula = $1, nombre_cliente = $2, telefono = $3, email = $4, direccion = $5 
             WHERE id_cliente = $6 RETURNING *`,
            [cedula, nombre_cliente, telefono, email, direccion, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Cliente no encontrado' 
            });
        }
        
        res.json({
            success: true,
            message: 'Cliente actualizado exitosamente',
            cliente: result.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al actualizar cliente' 
        });
    }
};

// Eliminar cliente (cambiar estado)
const eliminarCliente = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(
            'UPDATE clientes SET estado = false WHERE id_cliente = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Cliente no encontrado' 
            });
        }
        
        res.json({
            success: true,
            message: 'Cliente eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al eliminar cliente' 
        });
    }
};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};