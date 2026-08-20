import Link from "next/link";
import SiteImage from "./SiteImage";
import type { NewsItem } from "@/lib/types";
import type { TFunction } from "@/lib/i18n/shared";
import { readingLabel, readingMeta, readingMinutes } from "@/lib/readings";
import { IconArrowRight, IconBookOpen } from "@/lib/icons";

/** Local `YYYY-MM-DD` for a date-ish value (ISO string, plain date, or empty). */
function toDayKey(value?: string | null): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Never throws: always returns a valid `YYYY-MM-DD` key for grouping. */
function dayKeyOf(item: NewsItem): string {
  return (
    toDayKey(item.lessonDate) ||
    toDayKey(item.createdAt) ||
    toDayKey(new Date().toISOString())
  );
}

const formatLongDate = (key: string) =>
  new Date(`${key}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function DateChip({ dateKey }: { dateKey: string }) {
  const day = Number(dateKey.split("-")[2]);
  const monthShort = new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-GB", {
    month: "short",
  });
  return (
    <div className="flex shrink-0 flex-col items-center justify-center rounded-xl border border-gray-100 bg-navy-50 px-4 py-2 text-center">
      <span className="font-display text-2xl font-black leading-none text-navy-900">
        {day}
      </span>
      <span className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-gold-600">
        {monthShort}
      </span>
    </div>
  );
}

function PlaceholderIcon() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-800 to-navy-950">
      <IconBookOpen className="h-12 w-12 text-gold-500/80" />
    </div>
  );
}

function ReadingCard({ item, t }: { item: NewsItem; t: TFunction }) {
  const meta = readingMeta(item.type);
  const label = readingLabel(t, item.type, item.category);
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 border-t-4 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${meta?.bar ?? "border-t-navy-700"}`}
    >
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
          <span
            className={`self-start rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${meta?.badge ?? "bg-navy-100 text-navy-800"}`}
          >
            {label}
          </span>
        )}
        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-navy-900 transition-colors group-hover:text-navy-800">
          <Link href={`/news/${item.slug || item._id}`}>{item.title}</Link>
        </h3>
        <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3">{item.excerpt}</p>
        <div className="mt-4 flex items-center justify-between gap-2 text-xs text-gray-500">
          <span className="truncate">{item.author || "SDA Youth Ministry"}</span>
          <span className="shrink-0 font-semibold text-gray-400">
            {t("readings.minRead", {
              min: String(readingMinutes(item.content || "")),
            })}
          </span>
        </div>
        <Link
          href={`/news/${item.slug || item._id}`}
          className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full border border-gold-500 px-5 py-2 text-sm font-bold text-gold-600 transition-colors hover:bg-gold-500 hover:text-navy-900"
        >
          {t("readings.readNow")}
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

interface Group {
  key: string;
  items: NewsItem[];
}

interface LessonsFeedViewProps {
  items: NewsItem[];
  t: TFunction;
}

/**
 * Daily lessons view — every lesson is aligned to the date it belongs to
 * (`lessonDate` chosen in the admin, falling back to the creation date).
 * Newest day first, one clearly labelled section per day, so visitors always
 * recognise the content for a specific day.
 */
export default function LessonsFeedView({ items, t }: LessonsFeedViewProps) {
  const groups: Group[] = [];
  for (const item of items) {
    const key = dayKeyOf(item);
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.items.push(item);
    else groups.push({ key, items: [item] });
  }

  const todayKey = toDayKey(new Date().toISOString());

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {groups.map((group) => (
        <section
          key={group.key}
          aria-label={formatLongDate(group.key)}
          className="mt-14 first:mt-0 sm:mt-16"
        >
          <div className="flex items-center gap-4 border-b-2 border-navy-900 pb-3">
            <DateChip dateKey={group.key} />
            <div className="min-w-0">
              <h2 className="font-display text-lg font-extrabold uppercase tracking-[0.15em] text-navy-900 sm:text-xl">
                {formatLongDate(group.key)}
              </h2>
              <p className="mt-0.5 text-xs font-semibold text-gray-500">
                {t(
                  group.items.length === 1 ? "readings.lesson" : "readings.lessons",
                  { count: String(group.items.length) }
                )}
              </p>
            </div>
            {group.key === todayKey && (
              <span className="ml-auto shrink-0 rounded-full bg-gold-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy-900">
                {t("readings.today")}
              </span>
            )}
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => (
              <ReadingCard key={item._id} item={item} t={t} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}