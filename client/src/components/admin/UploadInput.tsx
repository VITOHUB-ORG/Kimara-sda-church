"use client";

import { useState } from "react";
import { API_URL, normalizeImageSrc } from "@/lib/api";
import { getToken, refreshAccessToken } from "@/lib/admin";
import { IconFile } from "@/lib/icons";

interface UploadInputProps {
  name: string;
  defaultValue?: string;
  accept?: string;
  label?: string;
}

export default function UploadInput({
  name,
  defaultValue = "",
  accept = "image/*",
  label = "Upload file",
}: UploadInputProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const isImage = accept.startsWith("image/");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");

    const form = new FormData();
    form.append("file", file);

    try {
      let res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: form,
      });
      if (res.status === 401 && (await refreshAccessToken())) {
        res = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: form,
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-navy-900 bg-navy-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-navy-800">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          {uploading ? "Uploading..." : label}
          <input
            type="file"
            accept={accept}
            onChange={handleFile}
            className="hidden"
          />
        </label>
        <span className="text-xs text-gray-500">
          {isImage ? "JPG, PNG, WEBP, GIF (max 15MB)" : "PDF (max 15MB)"}
        </span>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-3">
        <input
          type="text"
          inputMode="url"
          autoComplete="off"
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
        />
      </div>

      {url && isImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={normalizeImageSrc(url)}
          alt="Preview"
          className="mt-3 h-32 w-full rounded-xl border border-gray-200 object-cover"
        />
      )}
      {url && !isImage && (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-navy-800 hover:text-gold-600"
        >
          <IconFile className="h-4 w-4" />
          Open uploaded PDF
        </a>
      )}
    </div>
  );
}
