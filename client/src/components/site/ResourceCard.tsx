import type { Resource } from "@/lib/types";
import { resourceMeta } from "@/lib/ministries";
import { getI18n } from "@/lib/i18n/server";
import {
  IconBookOpen,
  IconSunrise,
  IconMic,
  IconHeart,
  IconSparkles,
  IconDownload,
  IconFile,
  type IconProps,
} from "@/lib/icons";

const typeIcons: Record<string, (props: IconProps) => React.ReactNode> = {
  "bible-study": IconBookOpen,
  devotional: IconSunrise,
  sermon: IconMic,
  prayer: IconHeart,
  testimony: IconSparkles,
  download: IconDownload,
};

export default async function ResourceCard({ resource }: { resource: Resource }) {
  const { t } = await getI18n();
  const meta = resourceMeta[resource.type];
  const Icon = typeIcons[resource.type] || IconFile;

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-100/60 text-navy-800">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 font-display text-lg font-bold text-navy-900">
        {resource.title}
      </h3>
      <p className="mt-1 text-sm font-semibold text-gold-600">{meta.label}</p>
      <p className="mt-2 flex-1 text-sm text-gray-600">{resource.description}</p>
      {resource.author && (
        <p className="mt-3 text-xs text-gray-500">— {resource.author}</p>
      )}
      {(resource.fileUrl || resource.link) && (
        <a
          href={resource.fileUrl || resource.link}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-navy-800 hover:text-gold-600"
        >
          {t("common.openResource")}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      )}
    </div>
  );
}