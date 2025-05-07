import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/rol`, {
          method: 'GET',
          credentials: 'include',
        });

        
        
        if (response.status === 200) {
          const data = await response.json();
          setUserRole(data.role);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error al verificar la autenticación:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    Swal.fire({
      icon: 'error',
      title: 'No autenticado',
      text: 'Por favor, inicie sesión para acceder.',
      customClass: {
        title: "my-title-class",
        popup: "my-popup-class",
        confirmButton: "my-confirm-button-class",
        overlay: "my-overlay-class",
      },
    });
    return <Navigate to="/iniciosesion" />;
  }

  if (!allowedRoles.includes(userRole)) {
    Swal.fire({
      icon: 'error',
      title: 'Acceso denegado',
      text: 'No tienes el rol necesario para acceder a esta función.',
      customClass: {
        title: "my-title-class",
        popup: "my-popup-class",
        confirmButton: "my-confirm-button-class",
        overlay: "my-overlay-class",
      },
    });
    return <Navigate to="/insideHome" />;
  }

  return children; 
};

export default ProtectedRoute;
