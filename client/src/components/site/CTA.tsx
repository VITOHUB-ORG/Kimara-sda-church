import Link from "next/link";
import { getI18n } from "@/lib/i18n/server";

export default async function CTA() {
  const { t } = await getI18n();

  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 sm:py-24">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(217,164,65,0.2) 0%, transparent 55%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-gold-400">
          {t("cta.eyebrow")}
        </p>
        <h2 className="mt-4 font-display text-3xl font-extrabold text-white sm:text-4xl">
          {t("cta.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-navy-100">
          {t("cta.desc")}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/resources"
            className="rounded-full bg-gold-500 px-7 py-3 text-center font-display text-sm font-bold uppercase tracking-wide text-navy-900 transition-colors hover:bg-gold-400"
          >
            {t("cta.learnJesus")}
          </Link>
          <Link
            href="/prayer"
            className="rounded-full border-2 border-white/30 px-7 py-3 text-center font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:border-white hover:bg-white/10"
          >
            {t("cta.requestPrayer")}
          </Link>
        </div>
      </div>
    </section>
  );
}