"use client";

import { getToken, refreshAccessToken } from "@/lib/admin";

const MAX_BYTES = 30 * 1024 * 1024;
const UPLOAD_TIMEOUT_MS = 120000;

export interface UploadProgress {
  percent: number;
  loadedBytes: number;
  totalBytes: number;
}

type ProgressCallback = (progress: UploadProgress) => void;

interface XhrResult {
  status: number;
  ok: boolean;
  json: Record<string, unknown>;
}

/**
 * Upload a file to the API with upload progress reporting.
 *
 * Strategy: try the direct API URL first (avoids proxy body-size limits on
 * platforms like Vercel for large files), then fall back to the same-origin
 * Next.js rewrite proxy. Uses XMLHttpRequest so we can report the progress of
 * the upload (bytes sent / total size). Returns the stored relative URL
 * (`/uploads/...`).
 */
export async function uploadFile(
  file: File,
  onProgress?: ProgressCallback
): Promise<string> {
  if (file.size > MAX_BYTES) {
    throw new Error("File too large. Maximum size is 30MB.");
  }

  const direct = process.env.NEXT_PUBLIC_API_URL || "";
  const bases = direct ? [direct, ""] : [""];
  let lastError: unknown = new Error("Upload failed");

  for (const base of bases) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await xhrPost(
          `${base}/api/upload`,
          file,
          getToken() ?? "",
          onProgress,
          UPLOAD_TIMEOUT_MS
        );
        if (res.status === 401 && attempt === 0 && (await refreshAccessToken())) {
          continue;
        }
        if (!res.ok) {
          const message = String(res.json.message || "");
          throw new Error(message || `Upload failed (${res.status})`);
        }
        return String(res.json.url || "");
      } catch (err) {
        lastError = err;
        break;
      }
    }
  }

  throw friendlyError(lastError);
}

function xhrPost(
  url: string,
  file: File,
  token: string,
  onProgress: ProgressCallback | undefined,
  timeoutMs: number
): Promise<XhrResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    form.append("file", file);

    xhr.open("POST", url);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.timeout = timeoutMs;

    xhr.upload.onprogress = (e) => {
      if (!onProgress) return;
      if (e.lengthComputable) {
        onProgress({
          percent: Math.round((e.loaded / e.total) * 100),
          loadedBytes: e.loaded,
          totalBytes: e.total,
        });
      }
    };

    xhr.onload = () => {
      let json: Record<string, unknown> = {};
      try {
        json = JSON.parse(xhr.responseText);
      } catch {
        json = {};
      }
      resolve({
        status: xhr.status,
        ok: xhr.status >= 200 && xhr.status < 300,
        json,
      });
    };
    xhr.onerror = () => reject(new Error("Failed to fetch"));
    xhr.ontimeout = () =>
      reject(
        new Error(
          "Upload timed out. The file is large — check your connection and try again."
        )
      );

    xhr.send(form);
  });
}

function friendlyError(err: unknown): Error {
  if (err instanceof Error) {
    if (
      err.message === "Failed to fetch" ||
      err.message.includes("load failed")
    ) {
      return new Error("Upload failed. Check your connection and try again.");
    }
    return err;
  }
  return new Error("Upload failed. Please try again.");
}