import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

// When a user has `must_change_password=true`, lock the app to /account.
// Allows /account, /logout, and language-only views (none currently).
const RequirePasswordReady = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  if (loading) return children;
  if (!currentUser?.mustChangePassword) return children;
  // Allow account page so user can update password
  if (location.pathname === "/account") return children;
  return <Navigate to="/account" replace />;
};

export default RequirePasswordReady;
