import { useAuth } from "./useAuth";
import { useImpersonation } from "./ImpersonationContext";

// Single source of truth for role-driven UI. Returns the effective role
// (impersonated role if admin is impersonating, otherwise real role).
export const useEffectiveRole = () => {
  const { role } = useAuth();
  const { effectiveRole } = useImpersonation();
  return effectiveRole ?? role ?? null;
};
