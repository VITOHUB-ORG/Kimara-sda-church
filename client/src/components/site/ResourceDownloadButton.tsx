"use client";

import { useEffect, useRef, useState } from "react";
import { IconDownload } from "@/lib/icons";

interface Props {
  fileUrl: string;
  fileName: string;
  label: string;
}

type Status = "idle" | "preparing" | "progress" | "done" | "error";

const toSameOrigin = (url: string): string => {
  if (/^https?:\/\//i.test(url)) {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  }
  return url;
};

function formatBytes(bytes: number): string {
  if (!bytes) return "";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function ResourceDownloadButton({
  fileUrl,
  fileName,
  label,
}: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [percent, setPercent] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  function handleDownload() {
    if (status === "preparing" || status === "progress") return;
    setStatus("preparing");
    setPercent(0);
    setLoaded(0);
    setTotal(0);
    setError("");

    const xhr = new XMLHttpRequest();
    xhr.open("GET", toSameOrigin(fileUrl), true);
    xhr.responseType = "blob";

    xhr.onprogress = (e) => {
      setStatus("progress");
      if (e.lengthComputable && e.total > 0) {
        setPercent(Math.round((e.loaded / e.total) * 100));
        setLoaded(e.loaded);
        setTotal(e.total);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300 && xhr.response) {
        const objectUrl = URL.createObjectURL(xhr.response as Blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = fileName || "download";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(objectUrl);
        setStatus("done");
        resetTimer.current = setTimeout(() => setStatus("idle"), 2500);
      } else {
        setError("Download failed. Please try again.");
        setStatus("error");
      }
    };

    xhr.onerror = () => {
      setError("Download failed. Check your connection and try again.");
      setStatus("error");
    };

    xhr.send();
  }

  if (status === "preparing") {
    return (
      <div className="w-full">
        <div className="flex w-full animate-pulse items-center justify-center gap-2 rounded-full bg-gray-200 px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-gray-400">
          <IconDownload className="h-4 w-4" />
          Preparing...
        </div>
      </div>
    );
  }

  if (status === "progress") {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between gap-3">
          <span className="font-display text-xs font-bold uppercase tracking-wide text-navy-900">
            Downloading {percent}%
          </span>
          {total > 0 && (
            <span className="text-xs font-semibold text-gray-500">
              {formatBytes(loaded)} / {formatBytes(total)}
            </span>
          )}
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-gold-500 transition-[width] duration-150"
            style={{ width: `${Math.max(4, percent)}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleDownload}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-navy-900 transition-colors hover:bg-gold-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
      >
        <IconDownload className="h-4 w-4" />
        {status === "done" ? "Downloaded ✓" : label}
      </button>
      {status === "error" && (
        <p className="mt-2 text-center text-xs font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}