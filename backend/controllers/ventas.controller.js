const pool = require('../database/db');

// Obtener todas las ventas
const obtenerVentas = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT v.*, 
                   COALESCE(c.nombre_cliente, u_cliente.nombre_usuario) as nombre_cliente,
                   u.nombre_usuario
            FROM ventas v
            LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
            LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
            LEFT JOIN usuarios u_cliente ON v.id_cliente = u_cliente.id_usuario
            ORDER BY v.fecha_venta DESC
        `);
        
        res.json({
            success: true,
            ventas: result.rows
        });
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener ventas' 
        });
    }
};

// Obtener venta por ID con detalles
const obtenerVentaPorId = async (req, res) => {
    const { id } = req.params;
    
    try {
        // Obtener venta
        const venta = await pool.query(`
            SELECT v.*, c.nombre_cliente, u.nombre_usuario
            FROM ventas v
            LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
            LEFT JOIN usuarios u ON v.id_usuario = u.id_usuario
            WHERE v.id_venta = $1
        `, [id]);
        
        if (venta.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Venta no encontrada' 
            });
        }
        
        // Obtener detalles de la venta
        const detalles = await pool.query(`
            SELECT dv.*, p.nombre_producto, p.codigo_producto
            FROM detalle_ventas dv
            LEFT JOIN productos p ON dv.id_producto = p.id_producto
            WHERE dv.id_venta = $1
        `, [id]);
        
        res.json({
            success: true,
            venta: {
                ...venta.rows[0],
                detalles: detalles.rows
            }
        });
    } catch (error) {
        console.error('Error al obtener venta:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener venta' 
        });
    }
};

// Crear venta con detalles
const crearVenta = async (req, res) => {
    const { id_cliente, productos, descuento, metodo_pago, observaciones } = req.body;
    const id_usuario = req.userId;
    
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');
        
        // Validar datos
        if (!productos || productos.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Debe incluir al menos un producto' 
            });
        }
        
        // Calcular subtotal
        const subtotal = productos.reduce((sum, item) => 
            sum + (item.cantidad * item.precio_unitario), 0
        );
        
        // Calcular total
        const total_venta = subtotal - (descuento || 0);
        
        // Generar número de venta
        const numero_venta = `VENT-${Date.now()}`;


 
        // Insertar venta
        const ventaResult = await client.query(
            `INSERT INTO ventas (numero_venta, id_cliente, id_usuario, subtotal, descuento, total_venta, metodo_pago, observaciones) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [numero_venta, id_cliente, id_usuario, subtotal, descuento || 0, total_venta, metodo_pago || 'efectivo', observaciones]
        );
        
        const id_venta = ventaResult.rows[0].id_venta;
        
        // Array para acumular los detalles con nombres y devolverlos al frontend
        const detallesRegistrados = [];

        // Insertar detalles de la venta
        for (const producto of productos) {
            // Verificar stock disponible y obtener el nombre del producto
            const stockCheck = await client.query(
                'SELECT stock_actual, nombre_producto FROM productos WHERE id_producto = $1',
                [producto.id_producto]
            );
            
            if (stockCheck.rows.length === 0 || stockCheck.rows[0].stock_actual < producto.cantidad) {
                throw new Error(`Stock insuficiente para el producto ID ${producto.id_producto}`);
            }
            
            // Agregamos el detalle a nuestra lista de respuesta
            detallesRegistrados.push({
                ...producto,
                nombre_producto: stockCheck.rows[0].nombre_producto
            });

            await client.query(
                `INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) 
                 VALUES ($1, $2, $3, $4)`,
                [id_venta, producto.id_producto, producto.cantidad, producto.precio_unitario]
            );
        }
        
        await client.query('COMMIT');
        
        res.status(201).json({
            success: true,
            message: 'Venta registrada exitosamente',
            venta: {
                ...ventaResult.rows[0],
                detalles: detallesRegistrados
            }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al crear venta:', error);
        
        // Detectar específicamente el error de llave foránea para dar un mensaje claro
        if (error.code === '23503' && error.constraint === 'ventas_id_cliente_fkey') {
            return res.status(400).json({ 
                success: false,
                message: 'Error de Base de Datos: No se puede registrar la venta porque existe una restricción (ventas_id_cliente_fkey). Ejecuta: ALTER TABLE ventas DROP CONSTRAINT ventas_id_cliente_fkey;' 
            });
        }

        res.status(500).json({ 
            success: false,
            message: error.message || 'Error al crear venta' 
        });
    } finally {
        client.release();
    }
};

// Obtener ventas del día
const obtenerVentasDelDia = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT v.*, c.nombre_cliente 
            FROM ventas v
            LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
            WHERE DATE(v.fecha_venta) = CURRENT_DATE
            ORDER BY v.fecha_venta DESC
        `);
        
        res.json({
            success: true,
            ventas: result.rows
        });
    } catch (error) {
        console.error('Error al obtener ventas del día:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener ventas del día' 
        });
    }
};

module.exports = {
    obtenerVentas,
    obtenerVentaPorId,
    crearVenta,
    obtenerVentasDelDia
};
