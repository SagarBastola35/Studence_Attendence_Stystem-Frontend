import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/Common/LoadingSpinner";

const Dashboard = () => {
  const { user, loading, isAdmin, isStudent } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (isStudent) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Dashboard;
