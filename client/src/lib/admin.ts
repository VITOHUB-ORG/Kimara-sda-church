"use client";

import { API_URL } from "./api";

const ACCESS_KEY = "sda_admin_token";
const REFRESH_KEY = "sda_admin_refresh";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_KEY);
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_KEY);
};

export const setToken = (accessToken: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_KEY, accessToken);
};

export const setRefreshToken = (refreshToken: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REFRESH_KEY, refreshToken);
};

export const clearToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
};

// Single-flight refresh: concurrent 401s share one refresh request.
let refreshPromise: Promise<boolean> | null = null;

export async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refresh = getRefreshToken();
    if (!refresh) return false;
    try {
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.accessToken || !data.refreshToken) {
        clearToken();
        return false;
      }
      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      return true;
    } catch {
      clearToken();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function revokeRefreshToken(): Promise<void> {
  const refresh = getRefreshToken();
  if (!refresh) return;
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
    });
  } catch {
    /* best effort — local tokens are cleared regardless */
  }
  clearToken();
}

export async function adminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const doFetch = (token: string | null): Promise<Response> =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

  let res = await doFetch(getToken());

  if (res.status === 401) {
    const ok = await refreshAccessToken();
    if (ok) res = await doFetch(getToken());
  }

  if (res.status === 401) {
    clearToken();
    throw new Error("Not authorized");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error: ${res.status}`);
  }
  return res.json();
}
