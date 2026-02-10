const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ============================================
// MIDDLEWARES GLOBALES
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging de peticiones
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// ============================================
// IMPORTAR RUTAS
// ============================================
const usuariosRoutes = require('./routes/usuarios.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const productosRoutes = require('./routes/productos.routes');
const clientesRoutes = require('./routes/clientes.routes');
const proveedoresRoutes = require('./routes/proveedores.routes');
const comprasRoutes = require('./routes/compras.routes');
const ventasRoutes = require('./routes/ventas.routes');
const reportesRoutes = require('./routes/reportes.routes');

// ============================================
// REGISTRAR RUTAS
// ============================================
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/reportes', reportesRoutes);

// ============================================
// RUTA RAÍZ (VERIFICACIÓN)
// ============================================
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '✅ API del Micro Bazar AbrahanIsaias funcionando correctamente',
        version: '1.0.0',
        endpoints: {
            usuarios: '/api/usuarios',
            categorias: '/api/categorias',
            productos: '/api/productos',
            clientes: '/api/clientes',
            proveedores: '/api/proveedores',
            compras: '/api/compras',
            ventas: '/api/ventas',
            reportes: '/api/reportes'
        }
    });
});

// ============================================
// MANEJO DE RUTAS NO ENCONTRADAS (404)
// ============================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// ============================================
// MANEJO DE ERRORES GLOBALES
// ============================================
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('==========================================');
    console.log('🚀 Servidor del Micro Bazar AbrahanIsaias');
    console.log('==========================================');
    console.log(`📍 Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📅 Fecha: ${new Date().toLocaleString()}`);
    console.log('==========================================');
});

module.exports = app;