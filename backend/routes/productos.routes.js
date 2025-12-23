const express = require('express');
const router = express.Router();
const {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductosBajoStock
} = require('../controllers/productos.controller');
const verificarToken = require('../middlewares/verificarToken');

// Rutas públicas
router.get('/', obtenerProductos);
router.get('/bajo-stock', obtenerProductosBajoStock);
router.get('/:id', obtenerProductoPorId);

// Rutas protegidas
router.post('/', verificarToken, crearProducto);
router.put('/:id', verificarToken, actualizarProducto);
router.delete('/:id', verificarToken, eliminarProducto);

module.exports = router;