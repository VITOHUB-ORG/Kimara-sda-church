"use client";

import { useState } from "react";
import { normalizeImageSrc } from "@/lib/api";
import { uploadFile, type UploadProgress } from "@/lib/upload";

function formatBytes(bytes: number): string {
  if (!bytes) return "";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

interface MultiUploadInputProps {
  name: string;
  defaultValue?: string[];
  label?: string;
}

export default function MultiUploadInput({
  name,
  defaultValue = [],
  label = "Upload image",
}: MultiUploadInputProps) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState("");

  function update(next: string[]) {
    setUrls(next);
    const input = document.getElementById(name) as HTMLInputElement | null;
    if (input) input.value = JSON.stringify(next);
  }

  function addUrl(raw: string) {
    const src = raw.trim();
    if (!src) return;
    if (!urls.includes(src)) update([...urls, src]);
  }

  function removeUrl(src: string) {
    update(urls.filter((u) => u !== src));
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...urls];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update(next);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setProgress({ percent: 0, loadedBytes: 0, totalBytes: file.size });

    try {
      const url = await uploadFile(file, setProgress);
      addUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setProgress(null);
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
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
        <span className="text-xs text-gray-500">JPG, PNG, WEBP, GIF (max 30MB). First image is the cover.</span>
      </div>

      <input id={name} type="hidden" name={name} value={JSON.stringify(urls)} readOnly />

      {uploading && progress && (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-gold-500 transition-[width] duration-150"
              style={{ width: `${Math.max(4, progress.percent)}%` }}
            />
          </div>
          <p className="mt-1 text-xs font-semibold text-gray-600">
            {progress.percent}% · {formatBytes(progress.loadedBytes)} /{" "}
            {formatBytes(progress.totalBytes)}
          </p>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          inputMode="url"
          autoComplete="off"
          placeholder="Paste image URL and press Add"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
        <button
          type="button"
          onClick={(e) => {
            const input = (e.currentTarget as HTMLButtonElement)
              .previousElementSibling as HTMLInputElement;
            addUrl(input.value);
            input.value = "";
          }}
          className="shrink-0 rounded-xl border border-navy-900 px-4 py-2.5 text-sm font-bold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
        >
          Add
        </button>
      </div>

      {urls.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {urls.map((src, i) => (
            <li key={src + i} className="overflow-hidden rounded-xl border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={normalizeImageSrc(src)} alt={`Image ${i + 1}`} className="h-24 w-full object-cover" />
              <div className="flex items-center justify-between gap-1 p-1.5">
                <span className="px-1 text-[11px] font-bold text-gray-500">
                  {i === 0 ? "Cover" : `#${i + 1}`}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                    aria-label="Move left"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === urls.length - 1}
                    className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                    aria-label="Move right"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    onClick={() => removeUrl(src)}
                    className="rounded-md border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-600 hover:text-white"
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
