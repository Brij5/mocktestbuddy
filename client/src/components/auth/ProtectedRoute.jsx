import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/**
 * A wrapper component for routes that require user authentication.
 * Checks if the user information exists in the Redux state.
 * If logged in, renders the nested route's component via <Outlet />.
 * If not logged in, redirects the user to the login page,
 * preserving the intended destination URL in the state.
 */
const ProtectedRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!userInfo) {
    // User not logged in, redirect to login page
    // Pass the current location state so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is logged in, render the child route component
  return <Outlet />;
};

export default ProtectedRoute;
