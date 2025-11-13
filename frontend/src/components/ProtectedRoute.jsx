//src/components/ProctectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Check if the access token exists in local storage
  const token = localStorage.getItem('accessToken');

  // 2. If the token exists, show the child component (e.g., Dashboard)
  //    The <Outlet /> component renders the nested child route.
  if (token) {
    return <Outlet />;
  }

  // 3. If no token, redirect the user to the /login page
  //    The 'replace' prop is good practice for login redirects.
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;