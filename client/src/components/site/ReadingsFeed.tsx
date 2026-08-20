import Link from "next/link";
import SiteImage from "./SiteImage";
import { apiGet, type Paginated } from "@/lib/api";
import { getI18n } from "@/lib/i18n/server";
import type { NewsItem } from "@/lib/types";
import {
  READING_TYPES,
  readingLabel,
  readingMeta,
  readingMinutes,
} from "@/lib/readings";
import { IconArrowRight, IconBookOpen } from "@/lib/icons";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function PlaceholderIcon() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-800 to-navy-950">
      <IconBookOpen className="h-12 w-12 text-gold-500/80" />
    </div>
  );
}

interface CardProps {
  item: NewsItem;
  t: (key: string, vars?: Record<string, string>) => string;
}

function ReadingCard({ item, t }: CardProps) {
  const meta = readingMeta(item.type);
  const label = readingLabel(t, item.type, item.category);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/news/${item.slug || item._id}`} className="block">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          {item.image ? (
            <SiteImage
              src={item.image}
              alt={item.title}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <PlaceholderIcon />
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {label && (
          <span className={`self-start rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${meta?.badge ?? "bg-navy-100 text-navy-800"}`}>
            {label}
          </span>
        )}
        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-navy-900 transition-colors group-hover:text-navy-800">
          <Link href={`/news/${item.slug || item._id}`}>{item.title}</Link>
        </h3>
        <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3">{item.excerpt}</p>
        <div className="mt-4 flex items-center justify-between gap-2 text-xs text-gray-500">
          <span>{formatDate(item.createdAt)}</span>
          <span className="font-semibold text-gray-400">
            {t("readings.minRead", { min: String(readingMinutes(item.content)) })}
          </span>
        </div>
        <Link
          href={`/news/${item.slug || item._id}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-gold-600 transition-colors hover:text-gold-500"
        >
          {t("readings.readNow")}
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

/**
 * Daily lessons library: the newest lesson is featured as "Today's Lesson",
 * then each category (Lesoni / Bobea / Kesha) gets its own section.
 */
export default async function ReadingsFeed() {
  const { t } = await getI18n();
  const data = await apiGet<Paginated<NewsItem>>("/api/public/news?limit=100").catch(() => null);
  const items = (data?.items ?? []).filter(
    (i) => i.published !== false && READING_TYPES.some((r) => r.value === i.type)
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-lg font-semibold text-navy-900">{t("readings.emptyTitle")}</p>
        <p className="mt-2 text-gray-500">{t("readings.emptyDesc")}</p>
      </div>
    );
  }

  const today = items[0];
  const todayMeta = readingMeta(today.type);
  const todayLabel = readingLabel(t, today.type, today.category);
  const rest = items.filter((i) => i._id !== today._id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Today's Reading hero */}
      <section aria-label={t("readings.todayTitle")}>
        <Link
          href={`/news/${today.slug || today._id}`}
          className="group relative block overflow-hidden rounded-2xl shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]">
            {today.image ? (
              <SiteImage
                src={today.image}
                alt={today.title}
                priority
                sizes="100vw"
                className="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            ) : (
              <PlaceholderIcon />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-10">
              <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
                {t("readings.todayTitle")}
              </p>
              <span
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${todayMeta?.badge ?? "bg-white/15 text-white"}`}
              >
                {todayLabel}
              </span>
              <h2 className="mt-2 max-w-3xl font-display text-2xl font-extrabold leading-tight text-white text-balance sm:text-3xl lg:text-4xl">
                {today.title}
              </h2>
              {today.excerpt && (
                <p className="mt-2 max-w-2xl line-clamp-2 text-sm text-navy-100 sm:text-base">
                  {today.excerpt}
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-navy-100 sm:text-sm">
                <time dateTime={today.createdAt}>{formatDate(today.createdAt)}</time>
                <span aria-hidden="true">·</span>
                <span>
                  {t("readings.minRead", { min: String(readingMinutes(today.content)) })}
                </span>
              </div>
              <span className="mt-4 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-gold-400 transition-colors group-hover:text-gold-300">
                {t("readings.readNow")}
                <IconArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Category sections */}
      {READING_TYPES.map((type) => {
        const group = rest.filter((i) => i.type === type.value).slice(0, 3);
        if (group.length === 0) return null;
        return (
          <section key={type.value} className="mt-14 sm:mt-16" aria-labelledby={`reading-${type.value}`}>
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${type.dot}`} aria-hidden="true" />
              <h2
                id={`reading-${type.value}`}
                className="border-b-2 border-navy-900 pb-1 font-display text-lg font-extrabold uppercase tracking-[0.15em] text-navy-900"
              >
                {t(type.labelKey)}
              </h2>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.map((item) => (
                <ReadingCard key={item._id} item={item} t={t} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}