import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const CheckAuth = ({ isAuthenticated, user, children }) => {
    const location = useLocation();

    if (location.pathname === "/") {
        if (!isAuthenticated) {
            return <Navigate to="/login" />
        }
        else {
            <Navigate to="/" />
        }
    }
    if (location.pathname === "/admin") {
        if (!isAuthenticated) {
            return <Navigate to="/login" />
        }
        else {
            <Navigate to="/admin" />
        }
    }
    if (!isAuthenticated && !(
        location.pathname.includes("/login") ||
        location.pathname.includes("/register")
    )
    ) {
        return <Navigate to="/login" />;
    }
    if (isAuthenticated &&
        (location.pathname.includes("/login") ||
        location.pathname.includes("/register"))
    ){
        if(user.role === "guest"){
            return <Navigate to="/" />
        }
        else{
            return <Navigate to ="/admin"/>
        }
    }
    return <>{children}</>;
}

export default CheckAuth