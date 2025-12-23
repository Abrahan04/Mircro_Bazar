const express = require('express');
const router = express.Router();
const {
    obtenerProveedores,
    obtenerProveedorPorId,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
} = require('../controllers/proveedores.controller');
const verificarToken = require('../middlewares/verificarToken');

// Todas las rutas requieren autenticación
router.get('/', verificarToken, obtenerProveedores);
router.get('/:id', verificarToken, obtenerProveedorPorId);
router.post('/', verificarToken, crearProveedor);
router.put('/:id', verificarToken, actualizarProveedor);
router.delete('/:id', verificarToken, eliminarProveedor);

module.exports = router;