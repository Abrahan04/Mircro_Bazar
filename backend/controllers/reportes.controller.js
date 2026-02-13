const pool = require('../database/db');

// Reporte: Productos con bajo stock
const reporteProductosBajoStock = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM vista_productos_bajo_stock
        `);
        
        res.json({
            success: true,
            productos: result.rows
        });
    } catch (error) {
        console.error('Error en reporte de bajo stock:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al generar reporte' 
        });
    }
};

// Reporte: Ventas diarias
const reporteVentasDiarias = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM vista_ventas_diarias
            LIMIT 30
        `);
        
        res.json({
            success: true,
            ventas: result.rows
        });
    } catch (error) {
        console.error('Error en reporte de ventas diarias:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al generar reporte' 
        });
    }
};

// Reporte: Productos más vendidos
const reporteProductosMasVendidos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM vista_productos_mas_vendidos
        `);
        
        res.json({
            success: true,
            productos: result.rows
        });
    } catch (error) {
        console.error('Error en reporte de productos más vendidos:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al generar reporte' 
        });
    }
};

// Reporte: Ventas por rango de fechas
const reporteVentasPorFecha = async (req, res) => {
    const { fecha_inicio, fecha_fin } = req.query;
    
    try {
        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({ 
                success: false,
                message: 'Debe proporcionar fecha_inicio y fecha_fin' 
            });
        }
        
        const result = await pool.query(`
            SELECT 
                DATE(v.fecha_venta) as fecha,
                COUNT(v.id_venta) as total_ventas,
                SUM(v.total_venta) as monto_total
            FROM ventas v
            WHERE v.fecha_venta BETWEEN $1 AND $2
            AND v.estado = 'completada'
            GROUP BY DATE(v.fecha_venta)
            ORDER BY fecha DESC
        `, [fecha_inicio, fecha_fin]);
        
        res.json({
            success: true,
            ventas: result.rows
        });
    } catch (error) {
        console.error('Error en reporte de ventas por fecha:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al generar reporte' 
        });
    }
};

// Dashboard: Estadísticas generales
const obtenerEstadisticasGenerales = async (req, res) => {
    try {
        // Total de ventas del mes actual
        const ventasMes = await pool.query(`
            SELECT COUNT(*) as total, COALESCE(SUM(total_venta), 0) as monto
            FROM ventas 
            WHERE EXTRACT(MONTH FROM fecha_venta) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM fecha_venta) = EXTRACT(YEAR FROM CURRENT_DATE)
            AND estado = 'completada'
        `);
        
        // Total de productos
        const totalProductos = await pool.query(`
            SELECT COUNT(*) as total FROM productos WHERE estado = true
        `);
        
        // Productos con bajo stock
        const bajoStock = await pool.query(`
            SELECT COUNT(*) as total FROM productos 
            WHERE stock_actual <= stock_minimo AND estado = true
        `);
        
        // Total de clientes (Cualquier usuario que no sea administrador)
        const totalClientes = await pool.query(`
            SELECT COUNT(*) as total FROM usuarios WHERE rol != 'administrador' AND estado = true
        `);
        
        res.json({
            success: true,
            estadisticas: {
                ventas_mes: {
                    total: parseInt(ventasMes.rows[0].total),
                    monto: parseFloat(ventasMes.rows[0].monto)
                },
                total_productos: parseInt(totalProductos.rows[0].total),
                productos_bajo_stock: parseInt(bajoStock.rows[0].total),
                total_clientes: parseInt(totalClientes.rows[0].total)
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener estadísticas' 
        });
    }
};

module.exports = {
    reporteProductosBajoStock,
    reporteVentasDiarias,
    reporteProductosMasVendidos,
    reporteVentasPorFecha,
    obtenerEstadisticasGenerales
};