import type { Event } from "@/lib/types";
import { ministryMeta } from "@/lib/ministries";
import { getYouTubeThumbnail, isYouTubeUrl } from "@/lib/youtube";
import { getI18n } from "@/lib/i18n/server";
import { IconClock, IconMapPin } from "@/lib/icons";
import Link from "next/link";
import SiteImage from "./SiteImage";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function EventCard({ event }: { event: Event }) {
  const { t } = await getI18n();
  const ministry =
    event.ministry !== "general" ? ministryMeta[event.ministry] : null;
  const youtubeThumb = getYouTubeThumbnail(event.youtubeUrl);
  const isLive = isYouTubeUrl(event.youtubeUrl);
  const image = event.image || youtubeThumb;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {image ? (
          <SiteImage
            src={image}
            alt={event.title}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        ) : isLive ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-navy-950">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-white">
              {t("site.brand")} Live
            </span>
          </div>
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ backgroundColor: ministry ? ministry.hex : "#12355B" }}
          >
            <span className="font-display text-3xl font-black uppercase text-white/90">
              {event.title.slice(0, 2)}
            </span>
          </div>
        )}

        {isLive && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            LIVE
          </span>
        )}
        {isLive && !event.image && (
          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur">
            ▶ {t("common.youtube")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {ministry && (
          <span
            className="mb-2 text-xs font-bold uppercase tracking-widest"
            style={{ color: ministry.hex }}
          >
            {ministry.label}
          </span>
        )}
        <h3 className="font-display text-lg font-bold text-navy-900">
          {event.title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3">
          {event.description}
        </p>
        <div className="mt-4 space-y-1 text-sm text-gray-500">
          {event.time ? (
            <p className="flex items-center gap-1.5 font-semibold text-navy-800">
              <IconClock className="h-4 w-4 shrink-0" />
              {event.time}
            </p>
          ) : (
            <p>
              {formatDate(event.startDate)}
              {event.endDate && ` – ${formatDate(event.endDate)}`}
            </p>
          )}
          {event.location && (
            <p className="flex items-center gap-1.5">
              <IconMapPin className="h-4 w-4 shrink-0 text-gray-400" />
              {event.location}
            </p>
          )}
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {isLive ? (
            <a
              href={event.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              {t("common.watchLiveNow")}
            </a>
          ) : (
            event.registrationLink && (
              <a
                href={event.registrationLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-navy-900 transition-colors hover:bg-gold-400"
              >
                {t("common.registerNow")}
              </a>
            )
          )}
          <Link
            href={`/events/${event.slug || event._id}`}
            className="inline-flex items-center justify-center rounded-full border border-navy-900 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
          >
            {t("common.details")}
          </Link>
        </div>
      </div>
    </div>
  );
}