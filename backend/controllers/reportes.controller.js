const prisma = require('../database/prisma');

// Reporte: Productos con bajo stock
const reporteProductosBajoStock = async (req, res) => {
    try {
        // Usamos queryRaw para consultar la vista SQL existente de forma segura
        const productos = await prisma.$queryRaw`SELECT * FROM vista_productos_bajo_stock`;
        
        res.json({
            success: true,
            productos: productos
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
        // Prisma permite consultas directas (Raw) cuando usas Vistas complejas de SQL
        // CORRECCIÓN: Filtramos por FECHA real (últimos 30 días) en lugar de solo limitar filas
        const ventas = await prisma.$queryRaw`SELECT * FROM vista_ventas_diarias WHERE fecha >= CURRENT_DATE - INTERVAL '30 days' ORDER BY fecha DESC`;
        
        res.json({
            success: true,
            ventas: ventas
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
        // Recomendación del tutor: Filtrar productos con pocas ventas.
        // Establecemos un rango mínimo (ej: ventas > 5) para que sea un reporte real de "Más Vendidos".
        const minimoVentas = 5; 

        const productos = await prisma.$queryRaw`
            SELECT * FROM vista_productos_mas_vendidos 
            WHERE cantidad_vendida > ${minimoVentas}
            ORDER BY cantidad_vendida DESC
        `;
        
        // Convertimos los resultados a números seguros para el frontend
        const productosFormateados = productos.map(p => ({
            ...p,
            cantidad_vendida: Number(p.cantidad_vendida),
            total_ingresos: Number(p.total_ingresos || 0)
        }));

        res.json({
            success: true,
            productos: productosFormateados
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
        
        // Aquí usamos queryRaw porque la consulta tiene funciones de fecha específicas de PostgreSQL (DATE())
        const ventas = await prisma.$queryRaw`
            SELECT
                DATE(v.fecha_venta) as fecha,
                COUNT(v.id_venta) as total_ventas,
                SUM(v.total_venta) as monto_total
            FROM ventas v
            WHERE v.fecha_venta BETWEEN ${new Date(fecha_inicio)} AND ${new Date(fecha_fin)}
            AND v.estado = 'completada'
            GROUP BY DATE(v.fecha_venta)
            ORDER BY fecha DESC`;

        // Convertimos los resultados a números seguros para el frontend
        const ventasFormateadas = ventas.map(v => ({
            fecha: v.fecha,
            total_ventas: Number(v.total_ventas),
            monto_total: Number(v.monto_total || 0)
        }));

        res.json({
            success: true,
            ventas: ventasFormateadas
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
        // --- AQUI ES DONDE EL ORM BRILLA ---
        // En lugar de SQL manual, usamos métodos de objetos.
        
        const fechaActual = new Date();
        const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
        const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);

        // Total de ventas del mes actual
        // Prisma calcula la suma y el conteo automáticamente
        const ventasMes = await prisma.ventas.aggregate({
            _count: { id_venta: true },
            _sum: { total_venta: true },
            where: {
                fecha_venta: {
                    gte: primerDiaMes,
                    lte: ultimoDiaMes
                },
                estado: 'completada'
            }
        });
        
        // Total de productos
        const totalProductos = await prisma.productos.count({
            where: { estado: true }
        });
        
        // Productos con bajo stock
        // Nota: Prisma no permite comparar dos columnas (stock_actual <= stock_minimo) directamente en el 'where' básico,
        // así que para este caso específico mantenemos queryRaw o filtramos en memoria si son pocos datos.
        // Por seguridad y rendimiento en tesis, usamos queryRaw para esta condición específica de columnas cruzadas.
        const bajoStock = await prisma.$queryRaw`
            SELECT COUNT(*) as total FROM productos 
            WHERE stock_actual <= stock_minimo AND estado = true
        `;
        
        // Total de clientes (Cualquier usuario que no sea administrador)
        const totalClientes = await prisma.usuarios.count({
            where: { 
                rol: { not: 'administrador' },
                estado: true 
            }
        });
        
        res.json({
            success: true,
            estadisticas: {
                ventas_mes: {
                    total: Number(ventasMes._count.id_venta),
                    monto: Number(ventasMes._sum.total_venta || 0)
                },
                total_productos: Number(totalProductos),
                productos_bajo_stock: Number(bajoStock[0]?.total || 0),
                total_clientes: Number(totalClientes)
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