import { notFound } from "next/navigation";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import type { Event } from "@/lib/types";
import { ministryMeta } from "@/lib/ministries";
import { getYouTubeEmbed, isYouTubeUrl } from "@/lib/youtube";
import { getI18n } from "@/lib/i18n/server";
import { IconMapPin } from "@/lib/icons";
import PageHeader from "@/components/site/PageHeader";
import SiteImage from "@/components/site/SiteImage";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await apiGet<Event>(`/api/public/events/${slug}`).catch(() => null);
  const { t } = await getI18n();

  if (!event) notFound();

  const ministry =
    event.ministry !== "general" ? ministryMeta[event.ministry] : null;
  const isLive = isYouTubeUrl(event.youtubeUrl);
  const embedUrl = getYouTubeEmbed(event.youtubeUrl);

  return (
    <>
      <PageHeader
        eyebrow={isLive ? t("common.watchLiveNow") : t("eventDetail.eventLabel")}
        title={event.title}
        description={event.description}
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {embedUrl ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
                  <iframe
                    src={embedUrl}
                    title={event.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              ) : event.image ? (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
                  <SiteImage src={event.image} alt={event.title} />
                </div>
              ) : (
                <div
                  className="flex h-72 w-full items-center justify-center rounded-2xl"
                  style={{ backgroundColor: ministry ? ministry.hex : "#12355B" }}
                >
                  <span className="font-display text-5xl font-black uppercase text-white/90">
                    {event.title.slice(0, 2)}
                  </span>
                </div>
              )}
              <div className="mt-8">
                <p className="text-lg leading-relaxed text-gray-600">
                  {event.description}
                </p>
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="font-display text-xs font-bold uppercase tracking-widest text-gray-500">
                  {t("eventDetail.when")}
                </p>
                <p className="mt-2 font-semibold text-navy-900">
                  {event.time
                    ? event.time
                    : formatDate(event.startDate)}
                  {!event.time &&
                    event.endDate &&
                    <> – {formatDate(event.endDate)}</>}
                </p>
                {event.time && (
                  <p className="mt-1 text-sm text-gray-500">
                    {formatDate(event.startDate)}
                  </p>
                )}

                {event.location && (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <p className="font-display text-xs font-bold uppercase tracking-widest text-gray-500">
                      {t("eventDetail.location")}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 font-semibold text-navy-900">
                      <IconMapPin className="h-4 w-4 shrink-0 text-gray-400" />
                      {event.location}
                    </p>
                  </div>
                )}

                {ministry && (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <p className="font-display text-xs font-bold uppercase tracking-widest text-gray-500">
                      {t("eventDetail.ministry")}
                    </p>
                    <p
                      className="mt-2 font-semibold"
                      style={{ color: ministry.hex }}
                    >
                      {ministry.label}
                    </p>
                  </div>
                )}

                {isLive && (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <p className="font-display text-xs font-bold uppercase tracking-widest text-gray-500">
                      {t("eventDetail.youtubeChannel")}
                    </p>
                    <p className="mt-2 font-semibold text-navy-900">
                      {t("eventDetail.channelName")}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {t("eventDetail.channelDesc")}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3">
                  {isLive && (
                    <a
                      href={event.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-700"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      {t("common.watchLiveNow")}
                    </a>
                  )}
                  {event.registrationLink && (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-gold-500 px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-navy-900 transition-colors hover:bg-gold-400"
                    >
                      {t("common.registerNow")}
                    </a>
                  )}
                  <Link
                    href="/events"
                    className="inline-flex items-center justify-center rounded-full border border-navy-900 px-6 py-3 font-display text-sm font-bold uppercase tracking-wide text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
                  >
                    {t("eventsPage.title")}
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}