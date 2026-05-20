import {
  readPersisted,
  writePersisted,
  clearPersisted,
} from "../lib/createPersistentStore";

const USERS_KEY = "heba-auth-users-v1";
const SESSION_KEY = "heba-auth-session-v1";

export const loadUsers = () => readPersisted(USERS_KEY, []);
export const saveUsers = (users) => writePersisted(USERS_KEY, users);

export const loadSession = () => readPersisted(SESSION_KEY, null);
export const saveSession = (session) => writePersisted(SESSION_KEY, session);
export const clearSession = () => clearPersisted(SESSION_KEY);
