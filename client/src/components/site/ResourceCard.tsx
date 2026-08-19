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
  IconArrowRight,
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
    <div className="relative flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      {resource.fileUrl && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gold-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-600">
          <IconDownload className="h-3 w-3" />
          {t("common.download")}
        </span>
      )}
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
      <div className="mt-5 border-t border-gray-100 pt-4">
        {resource.fileUrl ? (
          <a
            href={resource.fileUrl}
            download
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-navy-900 transition-colors hover:bg-gold-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
          >
            <IconDownload className="h-4 w-4" />
            {t("common.download")}
          </a>
        ) : resource.link ? (
          <a
            href={resource.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-navy-900 px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
          >
            {t("common.openResource")}
            <IconArrowRight className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </div>
  );
}