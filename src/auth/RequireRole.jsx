import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useEffectiveRole } from "./useEffectiveRole";
import { hasRole, ROLES } from "./roles";

const RequireRole = ({ role, children }) => {
  const { isAuthenticated, role: realRole } = useAuth();
  const effectiveRole = useEffectiveRole();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  // Real admin can always reach admin/staff routes regardless of impersonation.
  if (realRole === ROLES.ADMIN) return children;

  if (!hasRole(effectiveRole, role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireRole;
