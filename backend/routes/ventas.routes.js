const express = require('express');
const router = express.Router();
const {
    obtenerVentas,
    obtenerVentaPorId,
    crearVenta,
    obtenerVentasDelDia
} = require('../controllers/ventas.controller');
const verificarToken = require('../middlewares/verificarToken');

// Todas las rutas requieren autenticación
router.get('/', verificarToken, obtenerVentas);
router.get('/hoy', verificarToken, obtenerVentasDelDia);
router.get('/:id', verificarToken, obtenerVentaPorId);
router.post('/', verificarToken, crearVenta);

module.exports = router;