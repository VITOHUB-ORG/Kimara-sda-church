import { apiGet, type Paginated } from "@/lib/api";
import type { GalleryItem } from "@/lib/types";
import { getI18n } from "@/lib/i18n/server";
import PageHeader from "@/components/site/PageHeader";
import GalleryMasonry from "@/components/site/GalleryMasonry";

export const metadata = {
  title: "Gallery",
  description:
    "Photos and highlights from SDA Youth Ministry events — worship, fellowship, service, mission and leadership.",
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
            <GalleryMasonry items={data.items} />
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
