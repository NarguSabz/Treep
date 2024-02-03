import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppContext } from './AppContext';

const PrivateRoute = () => {
    const { isAuthenticated } = useAppContext();

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
export default PrivateRoute;