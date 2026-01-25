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
const upload = require('../config/multer');

// Rutas públicas
router.get('/', obtenerProductos);
router.get('/bajo-stock', obtenerProductosBajoStock);
router.get('/:id', obtenerProductoPorId);

// Rutas protegidas
router.post('/', verificarToken, upload.single('imagen'), crearProducto);
router.put('/:id', verificarToken, upload.single('imagen'), actualizarProducto);
router.delete('/:id', verificarToken, eliminarProducto);

module.exports = router;