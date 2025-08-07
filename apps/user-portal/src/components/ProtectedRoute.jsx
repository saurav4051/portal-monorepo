import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requiredRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;

    if (requiredRoles.includes(userRole)) {
      return children;
    } else {
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;