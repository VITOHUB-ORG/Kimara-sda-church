"use client";

import { getToken, refreshAccessToken } from "@/lib/admin";

const MAX_BYTES = 30 * 1024 * 1024;
const UPLOAD_TIMEOUT_MS = 120000;

/**
 * Upload a file to the API.
 *
 * Strategy: try the direct API URL first (avoids proxy body-size limits on
 * platforms like Vercel for large files), then fall back to the same-origin
 * Next.js rewrite proxy. Returns the stored relative URL (`/uploads/...`).
 */
export async function uploadFile(file: File): Promise<string> {
  if (file.size > MAX_BYTES) {
    throw new Error("File too large. Maximum size is 30MB.");
  }

  const form = new FormData();
  form.append("file", file);

  const direct = process.env.NEXT_PUBLIC_API_URL || "";
  const bases = direct ? [direct, ""] : [""];
  let lastError: unknown = new Error("Upload failed");

  for (const base of bases) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);
    try {
      let res = await fetch(`${base}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form,
        signal: controller.signal,
      });

      if (res.status === 401 && (await refreshAccessToken())) {
        res = await fetch(`${base}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: form,
          signal: controller.signal,
        });
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || `Upload failed (${res.status})`);
      return data.url as string;
    } catch (err) {
      lastError = err;
    } finally {
      clearTimeout(timer);
    }
  }

  throw friendlyError(lastError);
}

function friendlyError(err: unknown): Error {
  if (err instanceof Error) {
    if (err.name === "AbortError") {
      return new Error("Upload timed out. The file is large — check your connection and try again.");
    }
    if (err.message === "Failed to fetch" || err.message.includes("load failed")) {
      return new Error("Upload failed. Check your connection and try again.");
    }
    return err;
  }
  return new Error("Upload failed. Please try again.");
}