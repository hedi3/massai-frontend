// src/components/AuthRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthRoute = ({ children, redirectTo }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to={redirectTo} />;
};

export default AuthRoute;
