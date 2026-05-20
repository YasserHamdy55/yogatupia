import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. " +
      "Auth & data features will not work until these are set in .env.local.",
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseKey ?? "", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "yt-auth-token",
  },
});

// Secondary client used for admin actions that would otherwise overwrite
// the current session (e.g. signing up a new user from the Admin Users page).
// It uses a different storage key and never persists tokens.
let _adminTaskClient = null;
export const getAdminTaskClient = () => {
  if (_adminTaskClient) return _adminTaskClient;
  _adminTaskClient = createClient(supabaseUrl ?? "", supabaseKey ?? "", {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: "yt-auth-admin-task",
    },
  });
  return _adminTaskClient;
};

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
