const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.userRole)) {
            return res.status(403).json({ 
                success: false,
                message: 'Acceso denegado. No tienes permisos suficientes.' 
            });
        }
        next();
    };
};

module.exports = verificarRol;