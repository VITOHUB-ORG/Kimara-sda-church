// Server-side fetches need an absolute URL. Client-side fetches use a relative
// path so they go through the Next.js rewrite proxy (same-origin) and work from
// any device / LAN IP without CORS or localhost resolution problems.
const SERVER_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export const API_URL = typeof window === "undefined" ? SERVER_API : "";

export function normalizeImageSrc(src: string): string {
  if (typeof src === "string" && src.startsWith(SERVER_API)) {
    return src.slice(SERVER_API.length);
  }
  return src;
}

export async function apiGet<T>(
  path: string,
  revalidate?: number,
  timeoutMs = 10000
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: revalidate ? { revalidate } : undefined,
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error: ${res.status}`);
  }
  return res.json();
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}
