// Single source of truth for roles and capability checks.
// Keep this file free of UI / storage concerns.

export const ROLES = Object.freeze({
  CLIENT: "client",
  STAFF: "staff",
  ADMIN: "admin",
});

export const ROLE_VALUES = Object.values(ROLES);

// Hierarchy: admin > staff > client. Higher includes lower.
const RANK = {
  [ROLES.CLIENT]: 1,
  [ROLES.STAFF]: 2,
  [ROLES.ADMIN]: 3,
};

export const hasRole = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;
  return (RANK[userRole] ?? 0) >= (RANK[requiredRole] ?? 0);
};

export const isStaffOrAdmin = (role) => hasRole(role, ROLES.STAFF);
export const isAdmin = (role) => hasRole(role, ROLES.ADMIN);
