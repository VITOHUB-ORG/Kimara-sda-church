import Link from "next/link";
import SiteImage from "./SiteImage";
import { IconArrowRight, IconCalendar, IconNewspaper } from "@/lib/icons";

export interface EditorialItem {
  href: string;
  title: string;
  excerpt: string;
  image?: string;
  /** Small label shown above the title, e.g. the ministry/category name. */
  category?: string;
  /** Pre-formatted human-friendly date. */
  dateLabel: string;
  /** Machine-readable date for the <time> element. */
  dateIso?: string;
  /** Optional extra meta such as the event location. */
  meta?: string;
  /** Optional badge, e.g. "Upcoming". */
  badge?: string;
  /** Placeholder style when no image is available. */
  icon?: "event" | "news";
}

interface EditorialFeedProps {
  items: EditorialItem[];
  /** Label for the primary action on the featured story, e.g. "View Event". */
  viewAction: string;
  /** Heading above the compact list, e.g. "Recent Events". */
  recentHeading: string;
}

function Placeholder({ icon, className }: { icon: "event" | "news"; className?: string }) {
  const Icon = icon === "event" ? IconCalendar : IconNewspaper;
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-800 to-navy-950">
      <Icon className={`h-10 w-10 text-gold-500/80 ${className ?? ""}`} />
    </div>
  );
}

/**
 * Editorial news/events feed: the newest item becomes a large featured story
 * and the rest are shown as a compact list below it.
 */
export default function EditorialFeed({ items, viewAction, recentHeading }: EditorialFeedProps) {
  const [featured, ...recent] = items;

  if (!featured) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Featured latest story */}
      <article className="pb-10 sm:pb-12">
        <Link
          href={featured.href}
          className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
          aria-label={featured.title}
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-navy-100 sm:aspect-[16/8] lg:aspect-[21/9]">
            {featured.image ? (
              <SiteImage
                src={featured.image}
                alt={featured.title}
                priority
                sizes="(max-width: 768px) 100vw, 90vw"
                className="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            ) : (
              <Placeholder icon={featured.icon ?? "event"} />
            )}
          </div>
        </Link>

        <div className="mt-5 max-w-3xl">
          {featured.category && (
            <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
              {featured.category}
            </span>
          )}
          <h2 className="mt-2 font-display text-2xl font-extrabold leading-tight text-navy-900 text-balance sm:text-3xl lg:text-4xl">
            <Link
              href={featured.href}
              className="transition-colors hover:text-navy-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
            >
              {featured.title}
            </Link>
          </h2>
          {featured.excerpt && (
            <p className="mt-3 line-clamp-3 text-sm text-gray-600 sm:text-base lg:text-lg">
              {featured.excerpt}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
            {featured.badge && <span className="font-bold text-gold-600">{featured.badge}</span>}
            <time dateTime={featured.dateIso ?? featured.dateLabel}>{featured.dateLabel}</time>
            {featured.meta && (
              <>
                <span aria-hidden="true">·</span>
                <span>{featured.meta}</span>
              </>
            )}
          </div>
          <Link
            href={featured.href}
            className="mt-5 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-navy-900 transition-colors hover:text-gold-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
          >
            {viewAction}
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>

      {/* Recently published */}
      <section aria-labelledby="editorial-recent-heading" className="border-t border-gray-200 pt-8">
        <h2
          id="editorial-recent-heading"
          className="border-b-2 border-navy-900 pb-2 font-display text-sm font-extrabold uppercase tracking-[0.2em] text-navy-900"
        >
          {recentHeading}
        </h2>
        <ul>
          {recent.map((item) => (
            <li key={item.href} className="border-b border-gray-200 last:border-b-0">
              <Link
                href={item.href}
                className="group grid grid-cols-[7rem_1fr] gap-4 py-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500 sm:grid-cols-[12rem_1fr] sm:gap-6 sm:py-6"
              >
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg bg-navy-100">
                  {item.image ? (
                    <SiteImage
                      src={item.image}
                      alt={item.title}
                      sizes="(min-width: 640px) 192px, 112px"
                      className="transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <Placeholder icon={item.icon ?? "event"} className="h-8 w-8" />
                  )}
                </div>
                <div className="min-w-0">
                  {item.category && (
                    <span className="font-display text-[0.7rem] font-bold uppercase tracking-widest text-gold-600">
                      {item.category}
                    </span>
                  )}
                  <h3 className="mt-1 font-display text-base font-bold leading-snug text-navy-900 transition-colors group-hover:text-navy-700 sm:text-lg">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="mt-1 hidden text-sm text-gray-600 line-clamp-2 sm:block">
                      {item.excerpt}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500 sm:text-sm">
                    {item.badge && <span className="font-bold text-gold-600">{item.badge}</span>}
                    <time dateTime={item.dateIso ?? item.dateLabel}>{item.dateLabel}</time>
                    {item.meta && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{item.meta}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}