"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/client";

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const router = useRouter();

  function switchLang(next: "en" | "sw") {
    if (next === lang) return;
    setLang(next);
    router.refresh();
  }

  return (
    <div
      className="flex items-center rounded-full border border-white/20 p-0.5 text-xs font-bold"
      role="group"
      aria-label="Language"
    >
      {(["en", "sw"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchLang(code)}
          className={`rounded-full px-3 py-1.5 uppercase tracking-wide transition-colors ${
            lang === code
              ? "bg-gold-500 text-navy-900"
              : "text-navy-100 hover:text-white"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
