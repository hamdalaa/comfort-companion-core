// Lightweight client-side passcode gate for the admin demo dashboard.
//
// ⚠️ SECURITY NOTE: This is NOT real authentication. Anything in the client
// bundle (including the passcode) is visible to anyone who opens DevTools,
// and the unlocked flag lives in sessionStorage which a user can set
// manually. For production, replace this with real server-side auth
// (e.g. Lovable Cloud / Supabase Auth + a role check in an Edge Function)
// and protect any sensitive data via RLS.
//
// To change the passcode without touching code, set VITE_ADMIN_PASSCODE
// in your project secrets/env. A fallback exists so the demo keeps working
// locally.

const FALLBACK_PASSCODE = "teeh-2025";
const ADMIN_PASSCODE =
  (import.meta.env.VITE_ADMIN_PASSCODE as string | undefined)?.trim() || FALLBACK_PASSCODE;
const STORAGE_KEY = "teeh.admin.unlocked";

export function isAdminUnlocked(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function tryUnlockAdmin(passcode: string): boolean {
  if (passcode === ADMIN_PASSCODE) {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    return true;
  }
  return false;
}

export function lockAdmin(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
