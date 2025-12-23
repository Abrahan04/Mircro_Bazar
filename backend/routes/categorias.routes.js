const express = require('express');
const router = express.Router();
const {
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} = require('../controllers/categorias.controller');
const verificarToken = require('../middlewares/verificarToken');

// Rutas públicas
router.get('/', obtenerCategorias);

// Rutas protegidas
router.post('/', verificarToken, crearCategoria);
router.put('/:id', verificarToken, actualizarCategoria);
router.delete('/:id', verificarToken, eliminarCategoria);

module.exports = router;