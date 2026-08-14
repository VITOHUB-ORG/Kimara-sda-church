import { apiGet, type Paginated } from "@/lib/api";
import type { Ministry } from "@/lib/types";
import { getI18n } from "@/lib/i18n/server";
import PageHeader from "@/components/site/PageHeader";
import MinistryCard from "@/components/site/MinistryCard";

export const metadata = {
  title: "Ministries",
  description:
    "Explore the ministries of the SDA Youth Ministry — Adventurers, Pathfinders, Ambassadors, Young Adults and more.",
};

async function getMinistries() {
  return apiGet<Paginated<Ministry>>("/api/public/ministries?limit=50").catch(
    () => ({ items: [] as Ministry[], total: 0, page: 1, pages: 1 })
  );
}

export default async function MinistriesPage() {
  const data = await getMinistries();
  const { t } = await getI18n();

  return (
    <>
      <PageHeader
        eyebrow={t("ministriesPage.eyebrow")}
        title={t("ministriesPage.title")}
        description={t("ministriesPage.desc")}
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {data.items.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((ministry) => (
                <MinistryCard key={ministry._id} ministry={ministry} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              {t("ministriesPage.comingSoon")}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
