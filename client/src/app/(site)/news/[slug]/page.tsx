import { notFound } from "next/navigation";
import Link from "next/link";
import { apiGet } from "@/lib/api";
import type { NewsItem } from "@/lib/types";
import { getI18n } from "@/lib/i18n/server";
import PageHeader from "@/components/site/PageHeader";
import SiteImage from "@/components/site/SiteImage";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
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

  return (
    <>
      <PageHeader eyebrow={t("newsDetail.label")} title={item.title} />
      <section className="bg-white py-16 sm:py-20">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
            <span className="rounded-full bg-navy-100 px-3 py-1 font-semibold text-navy-800">
              {item.category}
            </span>
            <time>{formatDate(item.createdAt)}</time>
            {item.author && (
              <span>{t("newsDetail.by", { author: item.author })}</span>
            )}
          </div>

          {item.image && (
            <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl">
              <SiteImage src={item.image} alt={item.title} sizes="(max-width: 768px) 100vw, 768px" />
            </div>
          )}

          <p className="mt-8 text-xl font-medium leading-relaxed text-navy-900">
            {item.excerpt}
          </p>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-700">
            {item.content.split("\n").map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : null
            )}
          </div>

          <Link
            href="/news"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-navy-900 px-6 py-2.5 text-sm font-bold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
          >
            ← {t("common.backToNews")}
          </Link>
        </article>
      </section>
    </>
  );
}