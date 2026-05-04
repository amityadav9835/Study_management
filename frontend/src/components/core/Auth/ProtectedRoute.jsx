import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {

    const { token } = useSelector(state => state.auth);
    const { user } = useSelector(state => state.profile);

    // user logged in
    if (token !== null && user !== null) {
        return children;
    }

    return <Navigate to='/' />

}

export default ProtectedRoute
