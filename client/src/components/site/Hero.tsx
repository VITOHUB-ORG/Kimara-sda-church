import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";

export default async function Hero() {
  const { t, dict } = await getI18n();

  return (
    <section className="relative overflow-hidden bg-navy-950">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(29,78,137,0.55) 0%, rgba(10,30,58,0.95) 60%), radial-gradient(ellipse at 85% 80%, rgba(217,164,65,0.18) 0%, transparent 50%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-display text-xs font-bold uppercase tracking-[0.35em] text-gold-400">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mt-6 font-display text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl text-balance">
            {t("hero.titlePart1")}{" "}
            <span className="text-gold-400">{t("hero.titlePart2")}</span>,{" "}
            <span className="text-gold-400">{t("hero.titlePart3")}</span>,{" "}
            {t("hero.titlePart4")}{" "}
            <span className="text-gold-400">{t("hero.titlePart5")}</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-navy-100">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/ministries"
              className="rounded-full bg-gold-500 px-7 py-3 text-center font-display text-sm font-bold uppercase tracking-wide text-navy-900 transition-colors hover:bg-gold-400"
            >
              {t("hero.discover")}
            </Link>
            <Link
              href="/events"
              className="rounded-full border-2 border-white/30 px-7 py-3 text-center font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:border-white hover:bg-white/10"
            >
              {t("hero.events")}
            </Link>
            <Link
              href="/resources"
              className="rounded-full border-2 border-white/30 px-7 py-3 text-center font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:border-white hover:bg-white/10"
            >
              {t("hero.resources")}
            </Link>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10 bg-navy-900/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-4 py-4 sm:px-6 lg:px-8">
          {dict.hero.strip.map((step) => (
              <span
                key={step}
                className="font-display text-xs font-bold uppercase tracking-[0.2em] text-gold-400"
              >
                {step}
              </span>
            ))}
        </div>
      </div>
    </section>
  );
}