import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  supabase,
  isSupabaseConfigured,
  getAdminTaskClient,
} from "../lib/supabase";
import { ROLES } from "./roles";

export const AuthContext = createContext(null);

// Map DB role (customer/staff/admin/superadmin) → app role (client/staff/admin)
const mapDbRoleToAppRole = (dbRole) => {
  if (dbRole === "superadmin" || dbRole === "admin") return ROLES.ADMIN;
  if (dbRole === "staff") return ROLES.STAFF;
  return ROLES.CLIENT;
};

const mapAppRoleToDbRole = (appRole) => {
  if (appRole === ROLES.ADMIN) return "admin";
  if (appRole === ROLES.STAFF) return "staff";
  return "customer";
};

const buildCurrentUser = (session, profile) => {
  if (!session || !profile) return null;
  return {
    id: session.user.id,
    email: session.user.email || "",
    displayName: profile.full_name || "",
    whatsapp: profile.phone || "",
    phone: profile.phone || "",
    role: mapDbRoleToAppRole(profile.role),
    dbRole: profile.role,
    active: true,
    createdAt: profile.created_at,
    language: profile.language,
    mustChangePassword: !!profile.must_change_password,
  };
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    let cancelled = false;
    setProfileLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        // eslint-disable-next-line no-console
        console.error("[auth] failed to load profile", error);
        setProfile(null);
        setProfileLoading(false);
        return;
      }
      // If no profile row exists yet (e.g. trigger lag right after signup),
      // create a minimal one from the session so the user isn't bounced back to /login.
      if (!data) {
        const meta = session.user.user_metadata || {};
        const { data: inserted, error: insertErr } = await supabase
          .from("profiles")
          .insert({
            id: session.user.id,
            full_name: meta.full_name || "",
            phone: meta.phone || "",
          })
          .select()
          .maybeSingle();
        if (cancelled) return;
        if (insertErr) {
          // eslint-disable-next-line no-console
          console.error("[auth] failed to create profile", insertErr);
          setProfile(null);
        } else {
          setProfile(inserted);
        }
      } else {
        setProfile(data);
      }
      setProfileLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  useEffect(() => {
    if (!profile || !["staff", "admin", "superadmin"].includes(profile.role)) {
      setUsers([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        // eslint-disable-next-line no-console
        console.error("[auth] failed to load users", error);
        return;
      }
      setUsers(
        (data || []).map((p) => ({
          id: p.id,
          whatsapp: p.phone || "",
          phone: p.phone || "",
          displayName: p.full_name || "",
          email: "",
          role: mapDbRoleToAppRole(p.role),
          dbRole: p.role,
          active: true,
          createdAt: p.created_at,
        })),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [profile]);

  const currentUser = useMemo(
    () => buildCurrentUser(session, profile),
    [session, profile],
  );

  const signUpWithEmail = useCallback(
    async ({ email, password, fullName, phone }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || "",
            phone: phone || "",
          },
        },
      });
      if (error) throw error;
      return data;
    },
    [],
  );

  const loginWithEmail = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUsers([]);
  }, []);

  const updateCurrentUser = useCallback(
    async (patch) => {
      if (!currentUser) return;
      const dbPatch = {};
      if ("displayName" in patch) dbPatch.full_name = patch.displayName;
      if ("phone" in patch) dbPatch.phone = patch.phone;
      if ("whatsapp" in patch) dbPatch.phone = patch.whatsapp;
      if ("language" in patch) dbPatch.language = patch.language;
      if (Object.keys(dbPatch).length === 0) return;

      const { data, error } = await supabase
        .from("profiles")
        .update(dbPatch)
        .eq("id", currentUser.id)
        .select()
        .maybeSingle();
      if (error) {
        // eslint-disable-next-line no-console
        console.error("[auth] updateCurrentUser failed", error);
        return;
      }
      if (data) setProfile(data);
    },
    [currentUser],
  );

  const setUserRole = useCallback(async (userId, appRole) => {
    const dbRole = mapAppRoleToDbRole(appRole);
    const { error } = await supabase
      .from("profiles")
      .update({ role: dbRole })
      .eq("id", userId);
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[auth] setUserRole failed", error);
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: appRole, dbRole } : u)),
    );
  }, []);

  // Admin: update another user's profile (name / phone).
  const updateUserProfile = useCallback(async (userId, patch) => {
    const dbPatch = {};
    if ("displayName" in patch) dbPatch.full_name = patch.displayName;
    if ("phone" in patch) dbPatch.phone = patch.phone;
    if ("whatsapp" in patch) dbPatch.phone = patch.whatsapp;
    if (Object.keys(dbPatch).length === 0) return;

    const { error } = await supabase
      .from("profiles")
      .update(dbPatch)
      .eq("id", userId);
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[auth] updateUserProfile failed", error);
      throw error;
    }
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              displayName: dbPatch.full_name ?? u.displayName,
              phone: dbPatch.phone ?? u.phone,
              whatsapp: dbPatch.phone ?? u.whatsapp,
            }
          : u,
      ),
    );
  }, []);

  // Admin: create a new user directly. Uses a secondary Supabase client so
  // the admin's own session is not replaced. The new user must still
  // confirm their email if "Confirm email" is enabled in Supabase Auth.
  const createUser = useCallback(
    async ({ email, password, fullName, phone, role: appRole }) => {
      const taskClient = getAdminTaskClient();
      const { data, error } = await taskClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || "",
            phone: phone || "",
          },
        },
      });
      if (error) throw error;
      const newUserId = data?.user?.id;
      if (!newUserId) {
        throw new Error("Supabase did not return a user id.");
      }

      // Sign the task client out so it doesn't keep a stray session.
      await taskClient.auth.signOut().catch(() => {});

      // Assign the desired role (the trigger inserts a profile with role
      // 'customer' by default).
      const dbRole = mapAppRoleToDbRole(appRole);
      if (dbRole !== "customer") {
        const { error: roleErr } = await supabase
          .from("profiles")
          .update({ role: dbRole })
          .eq("id", newUserId);
        if (roleErr) {
          // eslint-disable-next-line no-console
          console.warn("[auth] could not assign role to new user", roleErr);
        }
      }

      // Refresh the local users list.
      setUsers((prev) => [
        {
          id: newUserId,
          whatsapp: phone || "",
          phone: phone || "",
          displayName: fullName || "",
          email,
          role: appRole,
          dbRole,
          active: true,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      return { id: newUserId };
    },
    [],
  );

  const verifyCurrentPassword = useCallback(
    async (password) => {
      if (!currentUser?.email) return false;
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: currentUser.email,
          password,
        });
        return !error;
      } catch {
        return false;
      }
    },
    [currentUser],
  );

  // Phase-2 stubs (legacy API kept for compatibility with existing pages).
  const signUpWithWhatsapp = useCallback(() => {
    throw new Error(
      "Phone-only signup is no longer supported. Please use email + password.",
    );
  }, []);

  const loginWithProvider = useCallback(() => {
    throw new Error(
      "Social login is being migrated. Please use email + password for now.",
    );
  }, []);

  const loginWithPassword = useCallback(
    async ({ email, password }) => {
      if (!email) {
        throw new Error("Admin login now uses email + password.");
      }
      return loginWithEmail({ email, password });
    },
    [loginWithEmail],
  );

  const registerLocalUser = useCallback(async () => {
    throw new Error(
      "Admin invite flow is part of Phase 2. Ask the new user to sign up via /signup, then promote them in Admin → Users.",
    );
  }, []);

  const setUserActive = useCallback(async () => {
    // eslint-disable-next-line no-console
    console.warn("[auth] setUserActive is not implemented in Phase 1.");
  }, []);

  const deleteUser = useCallback(async (userId) => {
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[auth] deleteUser failed", error);
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  }, []);

  const value = useMemo(
    () => ({
      users,
      currentUser,
      isAuthenticated: !!session,
      role: currentUser?.role ?? null,
      loading: loading || profileLoading,
      signUpWithEmail,
      loginWithEmail,
      signUpWithWhatsapp,
      loginWithProvider,
      loginWithPassword,
      verifyCurrentPassword,
      registerLocalUser,
      logout,
      updateCurrentUser,
      setUserRole,
      updateUserProfile,
      createUser,
      setUserActive,
      deleteUser,
    }),
    [
      users,
      currentUser,
      session,
      loading,
      profileLoading,
      signUpWithEmail,
      loginWithEmail,
      signUpWithWhatsapp,
      loginWithProvider,
      loginWithPassword,
      verifyCurrentPassword,
      registerLocalUser,
      logout,
      updateCurrentUser,
      setUserRole,
      updateUserProfile,
      createUser,
      setUserActive,
      deleteUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
