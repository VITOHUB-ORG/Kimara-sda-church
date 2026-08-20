import { notFound } from "next/navigation";
import Link from "next/link";
import { apiGet, type Paginated } from "@/lib/api";
import type { NewsItem } from "@/lib/types";
import { getI18n } from "@/lib/i18n/server";
import { readingLabel, readingMeta, readingMinutes } from "@/lib/readings";
import PageHeader from "@/components/site/PageHeader";
import SiteImage from "@/components/site/SiteImage";
import ShareButtons from "@/components/site/ShareButtons";
import { IconBookOpen, IconArrowLeft } from "@/lib/icons";

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

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await apiGet<NewsItem>(`/api/public/news/${slug}`).catch(() => null);
  const { t } = await getI18n();

  if (!item) notFound();

  const meta = readingMeta(item.type);
  const label = readingLabel(t, item.type, item.category);
  const minutes = readingMinutes(item.content);

  const related =
    (await apiGet<Paginated<NewsItem>>("/api/public/news?limit=6")
      .then((d) => d.items.filter((x) => x._id !== item._id).slice(0, 3))
      .catch(() => [])) ?? [];

  const paragraphs = item.content
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <PageHeader
        eyebrow={label}
        title={item.title}
      />
      <section className="bg-white py-14 sm:py-20">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${meta?.badge ?? "bg-navy-100 text-navy-800"}`}
            >
              {label}
            </span>
            <time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
            {item.author && (
              <span>{t("newsDetail.by", { author: item.author })}</span>
            )}
            <span aria-hidden="true">·</span>
            <span>
              {t("readings.minRead", { min: String(minutes) })}
            </span>
          </div>

          {/* Banner */}
          {item.image && (
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-lg">
              <SiteImage
                src={item.image}
                alt={item.title}
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          )}

          {/* Scripture reference */}
          {item.bibleText && (
            <blockquote className="mt-8 flex items-start gap-3 rounded-2xl border-l-4 border-gold-500 bg-navy-100/40 px-5 py-4">
              <IconBookOpen className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
                  {t("readings.bibleTextLabel")}
                </p>
                <p className="mt-1 font-display text-lg font-semibold italic text-navy-900">
                  {item.bibleText}
                </p>
              </div>
            </blockquote>
          )}

          {/* Lead paragraph */}
          {item.excerpt && (
            <p className="mt-8 text-xl font-medium leading-relaxed text-navy-900 sm:text-2xl">
              {item.excerpt}
            </p>
          )}

          {/* Body */}
          <div className="mt-6 space-y-5">
            {paragraphs.map((para, i) => (
              <p
                key={i}
                className={
                  i === 0 && !item.excerpt
                    ? "text-lg leading-relaxed text-gray-700 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-black first-letter:leading-[0.8] first-letter:text-gold-500"
                    : "text-lg leading-relaxed text-gray-700"
                }
              >
                {para}
              </p>
            ))}
          </div>

          {/* Share */}
          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-gray-200 pt-6">
            <p className="font-display text-sm font-bold uppercase tracking-wide text-navy-900">
              {t("readings.share")}
            </p>
            <ShareButtons title={item.title} />
          </div>

          {/* Related readings */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="border-b-2 border-navy-900 pb-2 font-display text-sm font-extrabold uppercase tracking-[0.2em] text-navy-900">
                {t("readings.related")}
              </h2>
              <ul className="mt-4">
                {related.map((r) => (
                  <li key={r._id} className="border-b border-gray-200 last:border-b-0">
                    <Link
                      href={`/news/${r.slug || r._id}`}
                      className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-gray-50"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-display text-base font-bold text-navy-900 group-hover:text-navy-700">
                          {r.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-gray-500">
                          {readingLabel(t, r.type, r.category)} ·{" "}
                          {formatDate(r.createdAt)}
                        </span>
                      </span>
                      <span className="font-display text-xs font-bold uppercase tracking-wide text-gold-600">
                        {t("readings.readNow")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href="/news"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-navy-900 px-6 py-2.5 text-sm font-bold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
          >
            <IconArrowLeft className="h-4 w-4" />
            {t("common.backToNews")}
          </Link>
        </article>
      </section>
    </>
  );
}