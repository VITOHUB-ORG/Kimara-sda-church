import type { NewsItem } from "@/lib/types";
import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";
import SiteImage from "./SiteImage";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default async function NewsCard({ item }: { item: NewsItem }) {
  const { t } = await getI18n();
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        {item.image ? (
          <SiteImage
            src={item.image}
            alt={item.title}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-navy-900">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 6h16M4 10h16M4 14h10M4 18h16" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="rounded-full bg-navy-100 px-3 py-1 font-semibold text-navy-800">
            {item.category}
          </span>
          <time>{formatDate(item.createdAt)}</time>
        </div>
        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-navy-900 group-hover:text-navy-800">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{item.excerpt}</p>
        <Link
          href={`/news/${item.slug || item._id}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-gold-600 hover:text-gold-500"
        >
          {t("common.readMore")}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </article>
  );
}