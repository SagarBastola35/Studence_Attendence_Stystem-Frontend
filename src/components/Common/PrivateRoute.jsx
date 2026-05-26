import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const PrivateRoute = ({ children, adminOnly = false, studentOnly = false }) => {
  const { user, loading, isAdmin, isStudent } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  if (studentOnly && !isStudent) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default PrivateRoute;
