export const authStorageKey = "vitafarma.supabase.auth";

const isBrowser = typeof window !== "undefined";

function setCookie(name: string, value: string) {
  if (!isBrowser) return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=604800; SameSite=Lax${secure}`;
}

function deleteCookie(name: string) {
  if (!isBrowser) return;

  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function getCookie(name: string) {
  if (!isBrowser) return null;

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));

  if (!cookie) return null;
  return decodeURIComponent(cookie.slice(name.length + 1));
}

export const authCookieStorage = {
  getItem(key: string) {
    if (!isBrowser) return null;
    return window.localStorage.getItem(key) ?? getCookie(key);
  },
  setItem(key: string, value: string) {
    if (!isBrowser) return;
    window.localStorage.setItem(key, value);
    setCookie(key, value);
  },
  removeItem(key: string) {
    if (!isBrowser) return;
    window.localStorage.removeItem(key);
    deleteCookie(key);
  },
};

export function readAccessTokenFromStoredSession(value?: string | null) {
  if (!value) return null;

  try {
    const session = JSON.parse(value.startsWith("{") ? value : decodeURIComponent(value));
    const expiresAt = Number(session?.expires_at ?? 0);
    if (expiresAt && expiresAt * 1000 <= Date.now()) return null;
    return typeof session?.access_token === "string" ? session.access_token : null;
  } catch {
    return null;
  }
}
