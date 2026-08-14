"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useI18n } from "@/lib/i18n/client";

export default function TestimonyForm() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      await apiPost("/api/public/testimonials", data);
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : t("forms.testimony.error")
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <p className="font-display text-lg font-bold text-green-800">
          {t("forms.testimony.successTitle")}
        </p>
        <p className="mt-2 text-sm text-green-700">
          {t("forms.testimony.successDesc")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-navy-900">
            {t("forms.testimony.name")}
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
          />
        </div>
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-semibold text-navy-900">
            {t("forms.testimony.title")}
          </label>
          <input
            id="title"
            name="title"
            placeholder={t("forms.testimony.titlePlaceholder")}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
          />
        </div>
      </div>
      <div>
        <label htmlFor="testimony" className="mb-1.5 block text-sm font-semibold text-navy-900">
          {t("forms.testimony.testimony")}
        </label>
        <textarea
          id="testimony"
          name="testimony"
          required
          rows={6}
          placeholder={t("forms.testimony.placeholder")}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gold-500 focus:ring-2 focus:ring-gold-100"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-gold-500 px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-navy-900 transition-colors hover:bg-gold-400 disabled:opacity-60"
      >
        {status === "loading" ? t("forms.testimony.submitting") : t("forms.testimony.submit")}
      </button>
      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}