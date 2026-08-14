import type { Ministry } from "@/lib/types";
import { ministryColors } from "@/lib/ministries";
import { getI18n } from "@/lib/i18n/server";
import Link from "next/link";

export default async function MinistryCard({ ministry }: { ministry: Ministry }) {
  const { t } = await getI18n();
  const color = ministryColors[ministry.slug];

  return (
    <Link
      href={`/ministries/${ministry.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className={`h-1.5 ${color.solid}`} />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold text-navy-900">
          {ministry.name}
        </h3>
        <p className={`mt-1 text-sm font-semibold ${color.text}`}>
          {ministry.tagline}
        </p>
        <p className="mt-3 flex-1 text-sm text-gray-600">
          {ministry.description}
        </p>
        <span
          className={`mt-5 inline-flex items-center gap-1.5 text-sm font-bold ${color.text}`}
        >
          {t("home.exploreMinistry")}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </span>
      </div>
    </Link>
  );
}