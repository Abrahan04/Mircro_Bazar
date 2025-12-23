const pool = require('../database/db');

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, c.nombre_categoria 
            FROM productos p 
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria 
            WHERE p.estado = true 
            ORDER BY p.nombre_producto
        `);
        
        res.json({
            success: true,
            productos: result.rows
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener productos' 
        });
    }
};

// Obtener producto por ID
const obtenerProductoPorId = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(`
            SELECT p.*, c.nombre_categoria 
            FROM productos p 
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria 
            WHERE p.id_producto = $1
        `, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Producto no encontrado' 
            });
        }
        
        res.json({
            success: true,
            producto: result.rows[0]
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener producto' 
        });
    }
};

// Crear producto
const crearProducto = async (req, res) => {
    const { 
        codigo_producto, 
        nombre_producto, 
        descripcion, 
        id_categoria, 
        precio_compra, 
        precio_venta, 
        stock_actual, 
        stock_minimo, 
        imagen_url 
    } = req.body;
    
    try {
        // Validar campos obligatorios
        if (!codigo_producto || !nombre_producto || !precio_compra || !precio_venta) {
            return res.status(400).json({ 
                success: false,
                message: 'Campos obligatorios incompletos' 
            });
        }
        
        const result = await pool.query(
            `INSERT INTO productos 
             (codigo_producto, nombre_producto, descripcion, id_categoria, 
              precio_compra, precio_venta, stock_actual, stock_minimo, imagen_url) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [codigo_producto, nombre_producto, descripcion, id_categoria, 
             precio_compra, precio_venta, stock_actual || 0, stock_minimo || 5, imagen_url]
        );
        
        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            producto: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al crear producto' 
        });
    }
};

// Actualizar producto
const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { 
        codigo_producto, 
        nombre_producto, 
        descripcion, 
        id_categoria, 
        precio_compra, 
        precio_venta, 
        stock_actual, 
        stock_minimo, 
        imagen_url 
    } = req.body;
    
    try {
        const result = await pool.query(
            `UPDATE productos 
             SET codigo_producto = $1, nombre_producto = $2, descripcion = $3, 
                 id_categoria = $4, precio_compra = $5, precio_venta = $6, 
                 stock_actual = $7, stock_minimo = $8, imagen_url = $9
             WHERE id_producto = $10 RETURNING *`,
            [codigo_producto, nombre_producto, descripcion, id_categoria, 
             precio_compra, precio_venta, stock_actual, stock_minimo, imagen_url, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Producto no encontrado' 
            });
        }
        
        res.json({
            success: true,
            message: 'Producto actualizado exitosamente',
            producto: result.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al actualizar producto' 
        });
    }
};

// Eliminar producto (cambiar estado)
const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(
            'UPDATE productos SET estado = false WHERE id_producto = $1 RETURNING *',
            [id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Producto no encontrado' 
            });
        }
        
        res.json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al eliminar producto' 
        });
    }
};

// Obtener productos con bajo stock
const obtenerProductosBajoStock = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, c.nombre_categoria 
            FROM productos p 
            LEFT JOIN categorias c ON p.id_categoria = c.id_categoria 
            WHERE p.stock_actual <= p.stock_minimo AND p.estado = true 
            ORDER BY p.stock_actual ASC
        `);
        
        res.json({
            success: true,
            productos: result.rows
        });
    } catch (error) {
        console.error('Error al obtener productos bajo stock:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener productos' 
        });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductosBajoStock
};