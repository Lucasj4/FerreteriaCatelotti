// PrivateRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const getToken = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('ferreteriaCookieToken='));
   
    return token ? token.split('=')[1] : null;
};

const decodeToken = (token) => {
    try {
        return jwt_decode(token);
    } catch (e) {
        return null;
    }
};


const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    console.log("Token decoded: ", token);
    
    if (decoded && decoded.exp) {
        const currentTime = Date.now() / 1000;  
        return decoded.exp < currentTime;  
    }
    return true;  // Si no hay expiración, consideramos que está expirado
};

const PrivateRoute = ({ component: Component, allowedRoles, ...rest }) => {
    const token = getToken();
    const decodedToken = token ? decodeToken(token) : null;
    const userRole = decodedToken ? decodedToken.user.rol : null;

    console.log(token);
    
    if (!token || isTokenExpired(token)) {
        // Si el token está expirado o no existe, redirigir al login
        return <Redirect to="/iniciosesion" />;
    }

   
    
    return (
        <Route
            {...rest}
            render={props =>
                token && allowedRoles.includes(userRole) ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

export default PrivateRoute;
