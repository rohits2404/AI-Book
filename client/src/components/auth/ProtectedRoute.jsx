import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2Icon } from "lucide-react";

export const ProtectedRoute = ({ children }) => {
  
    const { isAuthenticated, loading } = useAuth();
  
    const location = useLocation();

    if (loading) {
        return <Loader2Icon className="animate-spin" />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};
