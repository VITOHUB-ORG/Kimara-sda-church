"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useI18n } from "@/lib/i18n/client";

export default function PrayerForm() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const data = {
      ...Object.fromEntries(new FormData(form)),
      isPublic,
    };

    try {
      await apiPost("/api/public/prayers", data);
      setStatus("success");
      form.reset();
      setIsPublic(false);
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : t("forms.prayer.error")
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="font-display text-lg font-bold text-green-800">
          {t("forms.prayer.successTitle")}
        </p>
        <p className="mt-2 text-sm text-green-700">
          {t("forms.prayer.successDesc")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-navy-900">
          {t("forms.prayer.name")}
        </label>
        <input
          id="name"
          name="name"
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-navy-900">
          {t("forms.prayer.email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
        />
      </div>
      <div>
        <label htmlFor="prayer" className="mb-1.5 block text-sm font-semibold text-navy-900">
          {t("forms.prayer.prayer")}
        </label>
        <textarea
          id="prayer"
          name="prayer"
          required
          rows={5}
          placeholder={t("forms.prayer.placeholder")}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
        />
      </div>
      <label className="flex items-center gap-3 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="h-4 w-4 accent-gold-500"
        />
        {t("forms.prayer.publicShare")}
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-gold-500 px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-navy-900 transition-colors hover:bg-gold-400 disabled:opacity-60"
      >
        {status === "loading" ? t("forms.prayer.submitting") : t("forms.prayer.submit")}
      </button>
      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}