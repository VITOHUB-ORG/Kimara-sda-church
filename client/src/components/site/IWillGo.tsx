import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";

export default async function IWillGo({
  variant = "banner",
}: {
  variant?: "banner" | "section";
}) {
  const { t } = await getI18n();

  const logo = (
    <img
      src="/iwillgo-logo.png"
      alt={t("about.iwillgo.logoAlt")}
      className="h-full w-full object-contain"
    />
  );

  if (variant === "section") {
    return (
      <section className="bg-navy-100/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="flex justify-center">
              <div className="flex h-64 w-64 items-center justify-center rounded-3xl bg-white p-6 shadow-xl">
                {logo}
              </div>
            </div>
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
                {t("about.iwillgo.eyebrow")}
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold text-navy-900">
                {t("about.iwillgo.title")}
              </h2>
              <p className="mt-2 font-display text-sm font-bold text-gold-600">
                {t("about.iwillgo.tagline")}
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">
                {t("about.iwillgo.p1")}
              </p>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">
                {t("about.iwillgo.p2")}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-navy-900 py-14 sm:py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:flex-row lg:gap-10 lg:text-left lg:px-8">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-white p-3 shadow-lg">
          {logo}
        </div>
        <div className="flex-1">
          <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-gold-400">
            {t("about.iwillgo.eyebrow")}
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
            {t("about.iwillgo.title")}
          </h2>
          <p className="mt-2 font-display text-sm font-bold text-gold-400">
            {t("about.iwillgo.tagline")}
          </p>
          <p className="mt-4 text-navy-100">{t("about.iwillgo.p1")}</p>
        </div>
        <Link
          href="/about"
          className="shrink-0 rounded-full bg-gold-500 px-7 py-3 font-display text-sm font-bold uppercase tracking-wide text-navy-900 transition-colors hover:bg-gold-400"
        >
          {t("about.iwillgo.cta")}
        </Link>
      </div>
    </section>
  );
}
