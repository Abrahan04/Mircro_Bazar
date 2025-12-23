const express = require('express');
const router = express.Router();
const {
    reporteProductosBajoStock,
    reporteVentasDiarias,
    reporteProductosMasVendidos,
    reporteVentasPorFecha,
    obtenerEstadisticasGenerales
} = require('../controllers/reportes.controller');
const verificarToken = require('../middlewares/verificarToken');

// Todas las rutas requieren autenticación
router.get('/bajo-stock', verificarToken, reporteProductosBajoStock);
router.get('/ventas-diarias', verificarToken, reporteVentasDiarias);
router.get('/productos-mas-vendidos', verificarToken, reporteProductosMasVendidos);
router.get('/ventas-por-fecha', verificarToken, reporteVentasPorFecha);
router.get('/estadisticas', verificarToken, obtenerEstadisticasGenerales);

module.exports = router;