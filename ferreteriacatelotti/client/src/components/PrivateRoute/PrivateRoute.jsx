// PrivateRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const getToken = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('coderCookieToken='));
    return token ? token.split('=')[1] : null;
};

const decodeToken = (token) => {
    try {
        return jwt_decode(token);
    } catch (e) {
        return null;
    }
};

const PrivateRoute = ({ component: Component, allowedRoles, ...rest }) => {
    const token = getToken();
    const decodedToken = token ? decodeToken(token) : null;
    const userRole = decodedToken ? decodedToken.user.rol : null;

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
