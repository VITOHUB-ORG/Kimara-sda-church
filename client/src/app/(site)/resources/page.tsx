import { apiGet, type Paginated } from "@/lib/api";
import type { Resource } from "@/lib/types";
import { resourceMeta } from "@/lib/ministries";
import { getI18n } from "@/lib/i18n/server";
import PageHeader from "@/components/site/PageHeader";
import ResourceCard from "@/components/site/ResourceCard";

export const metadata = {
  title: "Resources",
  description:
    "Bible studies, devotionals, sermons, prayer and testimonies for the SDA Youth Ministry.",
};

async function getResources() {
  return apiGet<Paginated<Resource>>("/api/public/resources?limit=100").catch(
    () => ({ items: [] as Resource[], total: 0, page: 1, pages: 1 })
  );
}

export default async function ResourcesPage() {
  const data = await getResources();
  const { t } = await getI18n();

  return (
    <>
      <PageHeader
        eyebrow={t("resourcesPage.eyebrow")}
        title={t("resourcesPage.title")}
        description={t("resourcesPage.desc")}
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {data.items.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              {t("resourcesPage.comingSoon")}
            </p>
          )}

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(resourceMeta) as (keyof typeof resourceMeta)[]).map(
              (type) => {
                const meta = resourceMeta[type];
                return (
                  <div
                    key={type}
                    className="rounded-2xl border border-gray-100 bg-navy-100/40 p-6"
                  >
                    <h3 className="font-display text-lg font-bold text-navy-900">
                      {meta.label}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {meta.description}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </section>
    </>
  );
}
