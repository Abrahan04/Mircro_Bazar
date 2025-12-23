const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login
const login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Validar campos
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Email y contraseña son requeridos' 
            });
        }
        
        // Buscar usuario
        const result = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1 AND estado = true',
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: 'Credenciales inválidas' 
            });
        }
        
        const usuario = result.rows[0];
        
        // Verificar contraseña
        const passwordValida = await bcrypt.compare(password, usuario.password_hash);
        
        if (!passwordValida) {
            return res.status(401).json({ 
                success: false,
                message: 'Credenciales inválidas' 
            });
        }
        
        // Generar token JWT
        const token = jwt.sign(
            { 
                id: usuario.id_usuario, 
                rol: usuario.rol,
                nombre: usuario.nombre_usuario 
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );
        
        // Actualizar último acceso
        await pool.query(
            'UPDATE usuarios SET ultimo_acceso = CURRENT_TIMESTAMP WHERE id_usuario = $1',
            [usuario.id_usuario]
        );
        
        res.json({
            success: true,
            message: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre_usuario,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error en el servidor' 
        });
    }
};

// Registrar usuario (solo admin)
const registrarUsuario = async (req, res) => {
    const { nombre_usuario, email, password, rol } = req.body;
    
    try {
        // Validar campos
        if (!nombre_usuario || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Todos los campos son requeridos' 
            });
        }
        
        // Verificar si el email ya existe
        const emailExiste = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1',
            [email]
        );
        
        if (emailExiste.rows.length > 0) {
            return res.status(400).json({ 
                success: false,
                message: 'El email ya está registrado' 
            });
        }
        
        // Encriptar contraseña
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Insertar usuario
        const result = await pool.query(
            `INSERT INTO usuarios (nombre_usuario, email, password_hash, rol) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id_usuario, nombre_usuario, email, rol, fecha_creacion`,
            [nombre_usuario, email, passwordHash, rol || 'vendedor']
        );
        
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            usuario: result.rows[0]
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al registrar usuario' 
        });
    }
};

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id_usuario, nombre_usuario, email, rol, estado, 
                    fecha_creacion, ultimo_acceso 
             FROM usuarios 
             ORDER BY nombre_usuario`
        );
        
        res.json({
            success: true,
            usuarios: result.rows
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al obtener usuarios' 
        });
    }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, email, rol } = req.body;
    
    try {
        const result = await pool.query(
            `UPDATE usuarios 
             SET nombre_usuario = $1, email = $2, rol = $3 
             WHERE id_usuario = $4 
             RETURNING id_usuario, nombre_usuario, email, rol`,
            [nombre_usuario, email, rol, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
        }
        
        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente',
            usuario: result.rows[0]
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al actualizar usuario' 
        });
    }
};

// Cambiar estado del usuario
const cambiarEstadoUsuario = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    
    try {
        const result = await pool.query(
            'UPDATE usuarios SET estado = $1 WHERE id_usuario = $2 RETURNING *',
            [estado, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: 'Usuario no encontrado' 
            });
        }
        
        res.json({
            success: true,
            message: estado ? 'Usuario activado' : 'Usuario desactivado'
        });
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al cambiar estado' 
        });
    }
};

module.exports = {
    login,
    registrarUsuario,
    obtenerUsuarios,
    actualizarUsuario,
    cambiarEstadoUsuario
};