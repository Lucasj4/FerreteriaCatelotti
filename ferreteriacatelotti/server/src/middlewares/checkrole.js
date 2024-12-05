import jwt from 'jsonwebtoken'

export const checkUserRole = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.ferreteriaCookieToken;
    
    console.log("Token: ", token);
    

    if (token) {
        jwt.verify(token, 'ferreteria', (err, decoded) => {
            if (err) {
                res.status(403).send('Acceso denegado. Token inválido.');
            } else {
                const userRole = decoded.user.rol;     
                if (allowedRoles.includes(userRole)) {
                    next();
                } else {
                    res.status(403).send('Acceso denegado. No tienes permiso para acceder a esta página.');
                }
            }
        });
    } else {
        res.status(403).send('Acceso denegado. Token no proporcionado.');
    }
};