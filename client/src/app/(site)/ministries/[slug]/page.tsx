import { notFound } from "next/navigation";
import Link from "next/link";
import { apiGet, type Paginated } from "@/lib/api";
import type { Ministry } from "@/lib/types";
import { ministryColors, ministryMeta } from "@/lib/ministries";
import { getI18n } from "@/lib/i18n/server";
import PageHeader from "@/components/site/PageHeader";

async function getMinistry(slug: string) {
  const data = await apiGet<Paginated<Ministry>>("/api/public/ministries?limit=50").catch(
    () => ({ items: [] as Ministry[], total: 0, page: 1, pages: 1 })
  );
  return data.items.find((m) => m.slug === slug);
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function MinistryDetailPage({ params }: Props) {
  const { slug } = await params;
  const ministry = await getMinistry(slug);
  const { t } = await getI18n();

  if (!ministry) notFound();

  const color = ministryColors[ministry.slug];
  const meta = ministryMeta[ministry.slug];

  return (
    <>
      <PageHeader
        eyebrow={t("ministryDetail.eyebrow")}
        title={ministry.name}
        description={ministry.tagline}
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-extrabold text-navy-900">
                {t("ministryDetail.about", { name: ministry.name })}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">
                {ministry.description}
              </p>

              <div className="mt-10 rounded-2xl border border-gray-100 bg-navy-100/40 p-8">
                <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-gold-600">
                  {t("ministryDetail.visualMessage")}
                </p>
                <p className="mt-3 font-display text-2xl font-bold text-navy-900">
                  “{ministry.tagline}”
                </p>
              </div>
            </div>

            <aside className="lg:col-span-1">
              <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="font-display text-xs font-bold uppercase tracking-widest text-gray-500">
                  {t("ministryDetail.ministryColor")}
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <span
                    className="h-10 w-10 rounded-full"
                    style={{ backgroundColor: meta.hex }}
                  />
                  <span className="font-display font-bold text-navy-900">
                    {meta.label}
                  </span>
                </div>

                {ministry.leaderName && (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <p className="font-display text-xs font-bold uppercase tracking-widest text-gray-500">
                      {t("ministryDetail.ministryLeader")}
                    </p>
                    <p className="mt-2 font-display font-bold text-navy-900">
                      {ministry.leaderName}
                    </p>
                    {ministry.leaderTitle && (
                      <p className="text-sm text-gray-500">{ministry.leaderTitle}</p>
                    )}
                  </div>
                )}

                {ministry.contact && (
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <p className="font-display text-xs font-bold uppercase tracking-widest text-gray-500">
                      {t("ministryDetail.contact")}
                    </p>
                    <p className="mt-2 text-sm text-navy-900">{ministry.contact}</p>
                  </div>
                )}

                <Link
                  href="/contact"
                  className={`mt-6 block rounded-full ${color.solid} px-6 py-3 text-center font-display text-sm font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-90`}
                >
                  {t("ministryDetail.getInvolved")}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
