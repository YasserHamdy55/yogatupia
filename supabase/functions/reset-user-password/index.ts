// supabase/functions/reset-user-password/index.ts
//
// Admin-only edge function. Generates a temporary password for a target user,
// sets it on auth.users, flags the profile with must_change_password=true,
// and returns the plaintext password so the admin can deliver it via WhatsApp.
//
// Required env (auto-injected by Supabase):
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY
//
// Deploy:
//   supabase functions deploy reset-user-password --no-verify-jwt
//
// We verify the caller token manually below.

// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function generatePassword(len = 12) {
  const chars = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  let out = "";
  for (let i = 0; i < len; i++) out += chars[arr[i] % chars.length];
  return out;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // 1) Identify caller from Authorization header
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Missing auth token" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
  const callerId = userData.user.id;

  // 2) Check caller is admin/superadmin
  const { data: callerProfile, error: profErr } = await admin
    .from("profiles")
    .select("role")
    .eq("id", callerId)
    .maybeSingle();
  if (profErr || !callerProfile) {
    return new Response(JSON.stringify({ error: "Profile not found" }), {
      status: 403,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
  if (!["admin", "superadmin"].includes(callerProfile.role)) {
    return new Response(JSON.stringify({ error: "Not authorized" }), {
      status: 403,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // 3) Parse body
  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
  const targetUserId: string | undefined = body?.userId;
  if (!targetUserId) {
    return new Response(JSON.stringify({ error: "userId is required" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // 4) Look up target user (to return email back to caller)
  const { data: targetUserData, error: targetErr } =
    await admin.auth.admin.getUserById(targetUserId);
  if (targetErr || !targetUserData?.user) {
    return new Response(
      JSON.stringify({ error: targetErr?.message || "Target user not found" }),
      {
        status: 404,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }
  const targetEmail = targetUserData.user.email || "";

  // 5) Generate password and apply
  const tempPassword = generatePassword(12);
  const { error: updErr } = await admin.auth.admin.updateUserById(
    targetUserId,
    { password: tempPassword },
  );
  if (updErr) {
    return new Response(JSON.stringify({ error: updErr.message }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // 5) Flag the profile
  const { error: flagErr } = await admin
    .from("profiles")
    .update({ must_change_password: true, temporary_password: tempPassword })
    .eq("id", targetUserId);
  if (flagErr) {
    return new Response(
      JSON.stringify({
        error: `Password set but profile flag failed: ${flagErr.message}`,
      }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }

  return new Response(
    JSON.stringify({ ok: true, tempPassword, email: targetEmail }),
    { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
  );
});
