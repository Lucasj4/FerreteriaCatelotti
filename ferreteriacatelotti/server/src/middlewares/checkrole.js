import jwt from 'jsonwebtoken'

export const checkUserRole = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.ferreteriaCookieToken;
    
    if (token) {
        jwt.verify(token, 'ferreteria', (err, decoded) => {
            if (err) {
                res.status(403).json({message: "Acceso denegado. Token inválido."});
            } else {
                // Agrega esto para ver el contenido
                const userRole = decoded.user.userRole;
                if (allowedRoles.includes(userRole)) {
                    next();
                } else {
                    res.status(403).json({message: "Acceso denegado. No tienes permiso para esto."});
                }
            }
        });
        
    } else {
        res.status(403).json({message: "Acceso denegado. Token no proporcionado."});
    }
};