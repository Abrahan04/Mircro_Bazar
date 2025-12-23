const express = require('express');
const router = express.Router();
const {
    obtenerCompras,
    obtenerCompraPorId,
    crearCompra
} = require('../controllers/compras.controller');
const verificarToken = require('../middlewares/verificarToken');

// Todas las rutas requieren autenticación
router.get('/', verificarToken, obtenerCompras);
router.get('/:id', verificarToken, obtenerCompraPorId);
router.post('/', verificarToken, crearCompra);

module.exports = router;