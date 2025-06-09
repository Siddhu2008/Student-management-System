import React from "react";
import { Navigate } from "react-router-dom";

function RequireAdmin({ user, children }) {
  if (!user) return null; // or a spinner
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default RequireAdmin;
