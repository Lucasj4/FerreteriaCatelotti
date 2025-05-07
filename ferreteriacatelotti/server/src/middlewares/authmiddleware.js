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

// import jwt from 'jsonwebtoken';

// export function authMiddleware(req, res, next) {
    
//     req.logger.info("Desde authmiddleware")

//     // Obtener el token desde las cookies o encabezados de la solicitud
//     const token = req.cookies.ferreteriaCookieToken || req.headers['authorization']?.split(' ')[1];


//     console.log("token desde authmiddleware: ", token);
    
//     if (!token) {
//         return res.status(401).json({ message: "No se proporcionó token de autenticación" });
//     }

//     try {
//         // Decodificar el token para obtener su payload
//         const decoded = jwt.decode(token);

//         // Verificar si el token está decodificado y tiene el campo 'exp'
//         if (!decoded || !decoded.exp) {
//             return res.status(401).json({ message: "Token inválido" });
//         }

//         // Calcular el tiempo restante para la expiración
//         const expirationTime = decoded.exp * 1000; // Convertir de segundos a milisegundos
//         const currentTime = Date.now();
//         const timeRemaining = expirationTime - currentTime; // Tiempo restante en milisegundos

//         if (timeRemaining <= 0) {
//             return res.status(401).json({ message: "Token expirado, por favor inicia sesión nuevamente." });
//         }

//         // Convertir tiempo restante en minutos y segundos
//         const minutesRemaining = Math.floor(timeRemaining / 60000); // Minutos
//         const secondsRemaining = Math.floor((timeRemaining % 60000) / 1000); // Segundos

//         // Mostrar el tiempo restante
//         req.logger.info(`El token expira en: ${minutesRemaining} minutos y ${secondsRemaining} segundos`);

//         res.locals.isAuthenticated = true;
//         // Si el token es válido, adjuntar la información del usuario al objeto `req`
//         req.user = decoded;
//         next();
//     } catch (err) {
//         console.log("Error al decodificar el token:", err);
//         return res.status(500).json({ message: "Error en la autenticación" });
//     }
// }