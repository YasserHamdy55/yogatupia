import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  readPersisted,
  writePersisted,
  clearPersisted,
} from "../lib/createPersistentStore";
import { useAuth } from "./useAuth";
import { ROLES } from "./roles";
import { appendLog, AUDIT_TYPES } from "../lib/auditLog";

const KEY = "heba-impersonation-v1";
// Auto-expire after 1 hour of inactivity.
const TIMEOUT_MS = 60 * 60 * 1000;

const ImpersonationContext = createContext(null);

const loadState = () => readPersisted(KEY, null);

export const ImpersonationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [state, setState] = useState(loadState); // { role, lastActivity } | null
  const timerRef = useRef(null);

  // Persist on change.
  useEffect(() => {
    if (state) writePersisted(KEY, state);
    else clearPersisted(KEY);
  }, [state]);

  // Reset if real user is not admin (e.g. after logout, or impersonation
  // restored from storage but session no longer admin).
  useEffect(() => {
    if (state && currentUser?.role !== ROLES.ADMIN) {
      setState(null);
    }
  }, [currentUser, state]);

  // On mount: if persisted state is older than TIMEOUT, clear it.
  useEffect(() => {
    if (!state) return;
    if (Date.now() - (state.lastActivity || 0) > TIMEOUT_MS) {
      setState(null);
    }
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Idle timer: clears impersonation after TIMEOUT of no activity.
  useEffect(() => {
    if (!state) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    const elapsed = Date.now() - (state.lastActivity || 0);
    const remaining = Math.max(0, TIMEOUT_MS - elapsed);
    timerRef.current = setTimeout(() => {
      setState(null);
      appendLog({
        type: AUDIT_TYPES.IMPERSONATION_STOP,
        actorId: currentUser?.id,
        meta: { reason: "idle_timeout" },
      });
    }, remaining);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state, currentUser]);

  // Refresh activity timestamp on user interaction.
  useEffect(() => {
    if (!state) return;
    const bump = () => {
      setState((prev) => (prev ? { ...prev, lastActivity: Date.now() } : prev));
    };
    const opts = { passive: true };
    window.addEventListener("click", bump, opts);
    window.addEventListener("keydown", bump, opts);
    return () => {
      window.removeEventListener("click", bump, opts);
      window.removeEventListener("keydown", bump, opts);
    };
  }, [state ? true : false]); // eslint-disable-line react-hooks/exhaustive-deps

  const setEffectiveRole = useCallback(
    (role) => {
      if (currentUser?.role !== ROLES.ADMIN) return;
      if (!role || role === ROLES.ADMIN) {
        if (state) {
          appendLog({
            type: AUDIT_TYPES.IMPERSONATION_STOP,
            actorId: currentUser?.id,
          });
        }
        setState(null);
        return;
      }
      setState({ role, lastActivity: Date.now() });
      appendLog({
        type: AUDIT_TYPES.IMPERSONATION_START,
        actorId: currentUser?.id,
        meta: { role },
      });
    },
    [currentUser, state],
  );

  const resetImpersonation = useCallback(() => {
    if (state) {
      appendLog({
        type: AUDIT_TYPES.IMPERSONATION_STOP,
        actorId: currentUser?.id,
      });
    }
    setState(null);
  }, [state, currentUser]);

  const value = useMemo(
    () => ({
      effectiveRole:
        currentUser?.role === ROLES.ADMIN && state?.role
          ? state.role
          : (currentUser?.role ?? null),
      isImpersonating: currentUser?.role === ROLES.ADMIN && !!state?.role,
      impersonatedRole: state?.role || null,
      setEffectiveRole,
      resetImpersonation,
    }),
    [currentUser, state, setEffectiveRole, resetImpersonation],
  );

  return (
    <ImpersonationContext.Provider value={value}>
      {children}
    </ImpersonationContext.Provider>
  );
};

export const useImpersonation = () => {
  const ctx = useContext(ImpersonationContext);
  if (!ctx)
    throw new Error(
      "useImpersonation must be used within ImpersonationProvider",
    );
  return ctx;
};
