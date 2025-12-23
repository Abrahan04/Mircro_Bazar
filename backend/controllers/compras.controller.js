const pool = require('../database/db');

// Obtener todas las compras
const obtenerCompras = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT c.*, p.nombre_proveedor, u.nombre_usuario
            FROM compras c
            LEFT JOIN proveedores p ON c.id_proveedor = p.id_proveedor
            LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
            ORDER BY c.fecha_compra DESC
        `);
        
        res.json({
            success: true,
            compras: result.rows
        });
    } catch (error) {
        console.error('Error al obtener compras:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener compras' 
        });
    }
};

// Obtener compra por ID con detalles
const obtenerCompraPorId = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Obtener compra
        const compra = await pool.query(`
            SELECT c.*, p.nombre_proveedor, u.nombre_usuario
            FROM compras c
            LEFT JOIN proveedores p ON c.id_proveedor = p.id_proveedor
            LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
            WHERE c.id_compra = $1
        `, [id]);
        
        if (compra.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Compra no encontrada' 
            });
        }
        
        // Obtener detalles de la compra
        const detalles = await pool.query(`
            SELECT dc.*, p.nombre_producto, p.codigo_producto
            FROM detalle_compras dc
            LEFT JOIN productos p ON dc.id_producto = p.id_producto
            WHERE dc.id_compra = $1
        `, [id]);
        
        res.json({
            success: true,
            compra: {
                ...compra.rows[0],
                detalles: detalles.rows
            }
        });
    } catch (error) {
        console.error('Error al obtener compra:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener compra' 
        });
    }
};

// Crear compra con detalles
const crearCompra = async (req, res) => {
    const { id_proveedor, productos, observaciones } = req.body;
    const id_usuario = req.userId;
    
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Validar datos
        if (!id_proveedor || !productos || productos.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Datos incompletos' 
            });
        }
        
        // Calcular total
        const total_compra = productos.reduce((sum, item) => 
            sum + (item.cantidad * item.precio_unitario), 0
        );
        
        // Generar número de compra
        const numero_compra = `COMP-${Date.now()}`;
        
        // Insertar compra
        const compraResult = await client.query(
            `INSERT INTO compras (numero_compra, id_proveedor, id_usuario, total_compra, observaciones) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [numero_compra, id_proveedor, id_usuario, total_compra, observaciones]
        );
        
        const id_compra = compraResult.rows[0].id_compra;
        
        // Insertar detalles de la compra
        for (const producto of productos) {
            await client.query(
                `INSERT INTO detalle_compras (id_compra, id_producto, cantidad, precio_unitario) 
                 VALUES ($1, $2, $3, $4)`,
                [id_compra, producto.id_producto, producto.cantidad, producto.precio_unitario]
            );
        }
        
        await client.query('COMMIT');
        
        res.status(201).json({
            success: true,
            message: 'Compra registrada exitosamente',
            compra: compraResult.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear compra:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al crear compra' 
        });
    } finally {
        client.release();
    }
};

module.exports = {
    obtenerCompras,
    obtenerCompraPorId,
    crearCompra
};