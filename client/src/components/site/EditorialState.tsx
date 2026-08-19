"use client";

import { useRouter } from "next/navigation";
import { IconCalendar, IconNewspaper } from "@/lib/icons";

interface StateProps {
  message: string;
  description?: string;
  icon: "event" | "news";
}

export function EditorialEmpty({ message, description, icon }: StateProps) {
  const Icon = icon === "event" ? IconCalendar : IconNewspaper;
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-20 text-center">
        <Icon className="h-12 w-12 text-gray-300" />
        <h2 className="mt-4 font-display text-lg font-bold text-navy-900">{message}</h2>
        {description && <p className="mt-2 max-w-md text-sm text-gray-500">{description}</p>}
      </div>
    </div>
  );
}

export function EditorialErrorState({
  message,
  retryLabel,
  onRetry,
}: {
  message: string;
  retryLabel: string;
  onRetry?: () => void;
}) {
  const router = useRouter();
  const retry = onRetry ?? (() => router.refresh());

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-20 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-100 text-navy-800">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
        <h2 className="mt-4 font-display text-lg font-bold text-navy-900">{message}</h2>
        <button
          type="button"
          onClick={retry}
          className="mt-5 rounded-full bg-navy-900 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
        >
          {retryLabel}
        </button>
      </div>
    </div>
  );
}