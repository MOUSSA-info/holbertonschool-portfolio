import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Redirection vers login si pas connecté
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
