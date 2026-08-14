import type { Event } from "@/lib/types";
import { getYouTubeEmbed, isYouTubeUrl } from "@/lib/youtube";
import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";

export default async function WatchLive({ event }: { event?: Event | null }) {
  const { t, dict } = await getI18n();
  const isLiveEvent = event && isYouTubeUrl(event.youtubeUrl);
  const embedUrl = isLiveEvent ? getYouTubeEmbed(event.youtubeUrl) : null;

  return (
    <section className="relative overflow-hidden bg-navy-950 py-16 sm:py-24">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 20% 10%, rgba(220,38,38,0.15) 0%, transparent 55%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              {t("watchLive.badge")}
            </p>
            <h2 className="mt-5 font-display text-3xl font-extrabold text-white sm:text-4xl">
              {t("watchLive.title1")} <span className="text-gold-400">{t("watchLive.title2")}</span>
            </h2>
            <p className="mt-4 text-lg text-navy-100">{t("watchLive.desc")}</p>

            <div className="mt-8 space-y-3">
              {dict.watchLive.schedule.map((item) => (
                <div
                  key={item.day}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-navy-900/60 px-5 py-3"
                >
                  <span className="font-display font-bold text-white">
                    {item.day}
                  </span>
                  <span className="text-sm text-navy-100">{item.time}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {isLiveEvent && event ? (
                <a
                  href={event.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-700"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  {t("watchLive.ctaLive")}
                </a>
              ) : (
                <a
                  href="https://www.youtube.com/@kimarasdachurch6877"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-700"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  {t("watchLive.ctaSubscribe")}
                </a>
              )}
              <Link
                href="/events"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/30 px-7 py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:border-white hover:bg-white/10"
              >
                {t("watchLive.ctaEvents")}
              </Link>
            </div>
          </div>

          <div>
            {embedUrl ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <iframe
                  src={embedUrl}
                  title={t("common.watchLiveNow")}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            ) : (
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-navy-900 shadow-2xl">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <p className="font-display text-lg font-bold text-white">
                    {t("watchLive.placeholderTitle")}
                  </p>
                  <p className="max-w-sm px-6 text-sm text-navy-100">
                    {t("watchLive.placeholderDesc")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}