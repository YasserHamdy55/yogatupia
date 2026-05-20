// Lightweight in-app audit log persisted to localStorage.
// Best-effort only — NOT a security log. Trims to MAX entries FIFO.

import {
  readPersisted,
  writePersisted,
  clearPersisted,
} from "./createPersistentStore";

const KEY = "heba-audit-log-v1";
const MAX = 500;

export const AUDIT_TYPES = Object.freeze({
  LOGIN: "login",
  LOGIN_FAIL: "login_fail",
  LOGOUT: "logout",
  ROLE_CHANGE: "role_change",
  USER_TOGGLE: "user_toggle",
  USER_DELETE: "user_delete",
  ADMIN_CREATED: "admin_created",
  IMPERSONATION_START: "impersonation_start",
  IMPERSONATION_STOP: "impersonation_stop",
  LOGS_CLEARED: "logs_cleared",
  MESSAGE_SENT: "message_sent",
  PASSWORD_RESET_REQUESTED: "password_reset_requested",
});

export const readLog = () => readPersisted(KEY, []);

export const appendLog = (entry) => {
  const list = readLog();
  const next = [
    ...list,
    {
      id: `a_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      at: new Date().toISOString(),
      ...entry,
    },
  ];
  // FIFO trim
  while (next.length > MAX) next.shift();
  writePersisted(KEY, next);
  return next;
};

export const clearLog = () => clearPersisted(KEY);
