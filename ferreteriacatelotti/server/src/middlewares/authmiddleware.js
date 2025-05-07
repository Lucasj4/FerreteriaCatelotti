import passport from 'passport'


export function authMiddleware(req, res, next) {

    console.log("Cookies que llegan al backend:", req.cookies); 
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      
        if (err) {
            console.log("Error en autenticación: ", err);
            return next(err);
        }

        if (info && info.name === 'TokenExpiredError') {
            // El token ha expirado
            console.log("Token expirado");
            return res.status(401).json({ message: "Token expirado, por favor inicia sesión nuevamente." });
        }
        
        if (!user) {
            console.log("Usuario no autenticado");
            return res.status(401).json({ message: "No autenticado" });
        }
        
        res.locals.isAuthenticated = true;
        req.user = user;
        next();
    })(req, res, next);
}

