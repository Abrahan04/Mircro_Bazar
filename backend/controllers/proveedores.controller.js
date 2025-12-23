const pool = require('../database/db');

// Obtener todos los proveedores
const obtenerProveedores = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM proveedores WHERE estado = true ORDER BY nombre_proveedor'
        );
        
        res.json({
            success: true,
            proveedores: result.rows
        });
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener proveedores' 
        });
    }
};

// Obtener proveedor por ID
const obtenerProveedorPorId = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(
            'SELECT * FROM proveedores WHERE id_proveedor = $1',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Proveedor no encontrado' 
            });
        }
        
        res.json({
            success: true,
            proveedor: result.rows[0]
        });
    } catch (error) {
        console.error('Error al obtener proveedor:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener proveedor' 
        });
    }
};

// Crear proveedor
const crearProveedor = async (req, res) => {
    const { nombre_proveedor, ruc, telefono, email, direccion } = req.body;
    
    try {
        if (!nombre_proveedor) {
            return res.status(400).json({ 
                success: false,
                message: 'El nombre del proveedor es requerido' 
            });
        }
        
        const result = await pool.query(
            `INSERT INTO proveedores (nombre_proveedor, ruc, telefono, email, direccion) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [nombre_proveedor, ruc, telefono, email, direccion]
        );
        
        res.status(201).json({
            success: true,
            message: 'Proveedor creado exitosamente',
            proveedor: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear proveedor:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al crear proveedor' 
        });
    }
};

// Actualizar proveedor
const actualizarProveedor = async (req, res) => {
    const { id } = req.params;
    const { nombre_proveedor, ruc, telefono, email, direccion } = req.body;
    
    try {
        const result = await pool.query(
            `UPDATE proveedores 
             SET nombre_proveedor = $1, ruc = $2, telefono = $3, email = $4, direccion = $5 
             WHERE id_proveedor = $6 RETURNING *`,
            [nombre_proveedor, ruc, telefono, email, direccion, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Proveedor no encontrado' 
            });
        }
        
        res.json({
            success: true,
            message: 'Proveedor actualizado exitosamente',
            proveedor: result.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar proveedor:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al actualizar proveedor' 
        });
    }
};

// Eliminar proveedor (cambiar estado)
const eliminarProveedor = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(
            'UPDATE proveedores SET estado = false WHERE id_proveedor = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Proveedor no encontrado' 
            });
        }
        
        res.json({
            success: true,
            message: 'Proveedor eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al eliminar proveedor' 
        });
    }
};

module.exports = {
    obtenerProveedores,
    obtenerProveedorPorId,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
};