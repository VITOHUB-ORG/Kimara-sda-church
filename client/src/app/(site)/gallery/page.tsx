import { apiGet, type Paginated } from "@/lib/api";
import type { GalleryItem } from "@/lib/types";
import { getI18n } from "@/lib/i18n/server";
import PageHeader from "@/components/site/PageHeader";
import SiteImage from "@/components/site/SiteImage";

export const metadata = {
  title: "Gallery",
  description:
    "Photos and highlights from SDA Youth Ministry events — worship, fellowship, service, mission and leadership.",
};

const categoryMeta: Record<string, { label: string; hex: string }> = {
  worship: { label: "Worship", hex: "#1D4E89" },
  fellowship: { label: "Fellowship", hex: "#26828E" },
  service: { label: "Service", hex: "#3A7D44" },
  mission: { label: "Mission", hex: "#8E3B46" },
  leadership: { label: "Leadership", hex: "#D9A441" },
};

async function getGallery() {
  return apiGet<Paginated<GalleryItem>>("/api/public/gallery?limit=100").catch(
    () => ({ items: [] as GalleryItem[], total: 0, page: 1, pages: 1 })
  );
}

export default async function GalleryPage() {
  const data = await getGallery();
  const { t } = await getI18n();

  return (
    <>
      <PageHeader
        eyebrow={t("galleryPage.eyebrow")}
        title={t("galleryPage.title")}
        description={t("galleryPage.desc")}
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {data.items.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((item) => (
                <figure
                  key={item._id}
                  className="group overflow-hidden rounded-2xl bg-navy-100/40 shadow-sm"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    {item.image ? (
                      <SiteImage
                        src={item.image}
                        alt={item.title || item.caption || "Gallery image"}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-navy-900">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D9A441" strokeWidth="1.5" strokeLinecap="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="M21 15l-5-5-9 9" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <figcaption className="flex flex-wrap items-center justify-between gap-2 p-4">
                    <span className="text-sm font-semibold text-navy-900">
                      {item.title || item.caption || "Youth Ministry"}
                    </span>
                    {item.category && (
                      <span
                        className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
                        style={{
                          backgroundColor: categoryMeta[item.category]?.hex ?? "#12355B",
                        }}
                      >
                        {categoryMeta[item.category]?.label ?? item.category}
                      </span>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              {t("galleryPage.comingSoon")}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
