const pool = require('../database/db');

// Obtener todas las categorías
const obtenerCategorias = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM categorias WHERE estado = true ORDER BY nombre_categoria'
        );
        
        res.json({
            success: true,
            categorias: result.rows
        });
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener categorías' 
        });
    }
};

// Crear categoría
const crearCategoria = async (req, res) => {
    const { nombre_categoria, descripcion } = req.body;
    
    try {
        if (!nombre_categoria) {
            return res.status(400).json({ 
                success: false,
                message: 'El nombre de la categoría es requerido' 
            });
        }
        
        const result = await pool.query(
            `INSERT INTO categorias (nombre_categoria, descripcion) 
             VALUES ($1, $2) RETURNING *`,
            [nombre_categoria, descripcion]
        );
        
        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            categoria: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear categoría:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al crear categoría' 
        });
    }
};

// Actualizar categoría
const actualizarCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre_categoria, descripcion } = req.body;
    
    try {
        const result = await pool.query(
            `UPDATE categorias 
             SET nombre_categoria = $1, descripcion = $2 
             WHERE id_categoria = $3 RETURNING *`,
            [nombre_categoria, descripcion, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Categoría no encontrada' 
            });
        }
        
        res.json({
            success: true,
            message: 'Categoría actualizada exitosamente',
            categoria: result.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar categoría:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al actualizar categoría' 
        });
    }
};

// Eliminar categoría (cambiar estado)
const eliminarCategoria = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(
            'UPDATE categorias SET estado = false WHERE id_categoria = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Categoría no encontrada' 
            });
        }
        
        res.json({
            success: true,
            message: 'Categoría eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al eliminar categoría' 
        });
    }
};

module.exports = {
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};