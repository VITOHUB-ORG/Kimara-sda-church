import { apiGet, type Paginated } from "@/lib/api";
import type { NewsItem } from "@/lib/types";
import { getI18n } from "@/lib/i18n/server";
import PageHeader from "@/components/site/PageHeader";
import NewsCard from "@/components/site/NewsCard";

export const metadata = {
  title: "News",
  description:
    "Official updates, announcements and reports from the SDA Youth Ministry.",
};

async function getNews() {
  return apiGet<Paginated<NewsItem>>("/api/public/news?limit=50").catch(
    () => ({ items: [] as NewsItem[], total: 0, page: 1, pages: 1 })
  );
}

export default async function NewsPage() {
  const data = await getNews();
  const { t } = await getI18n();

  return (
    <>
      <PageHeader
        eyebrow={t("newsPage.eyebrow")}
        title={t("newsPage.title")}
        description={t("newsPage.desc")}
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {data.items.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.items.map((item) => (
                <NewsCard key={item._id} item={item} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              {t("newsPage.noItems")}
            </p>
          )}
        </div>
      </section>
    </>
  );
}