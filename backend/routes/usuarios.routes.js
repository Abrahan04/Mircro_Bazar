const express = require('express');
const router = express.Router();
const {
    login,
    registrarUsuario,
    obtenerUsuarios,
    actualizarUsuario,
    cambiarEstadoUsuario
} = require('../controllers/usuarios.controller');
const verificarToken = require('../middlewares/verificarToken');
const verificarRol = require('../middlewares/verificarRol');

// Rutas públicas
router.post('/login', login);

// Rutas protegidas (requieren autenticación)
router.get('/', verificarToken, verificarRol(['administrador']), obtenerUsuarios);
router.post('/registrar', verificarToken, verificarRol(['administrador']), registrarUsuario);
router.put('/:id', verificarToken, verificarRol(['administrador']), actualizarUsuario);
router.patch('/:id/estado', verificarToken, verificarRol(['administrador']), cambiarEstadoUsuario);

module.exports = router;