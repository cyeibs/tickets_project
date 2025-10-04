import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export const RegisterPage: React.FC = () => {
  // This page is just a redirect to login since registration happens on the login page
  return <Navigate to="/login" replace />;
};
