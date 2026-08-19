import { Suspense } from "react";
import { getI18n } from "@/lib/i18n/server";
import PageHeader from "@/components/site/PageHeader";
import NewsFeed from "@/components/site/NewsFeed";
import EditorialSkeleton from "@/components/site/EditorialSkeleton";

export const metadata = {
  title: "News",
  description:
    "Official updates, announcements and reports from the SDA Youth Ministry.",
};

export default async function NewsPage() {
  const { t } = await getI18n();

  return (
    <>
      <PageHeader
        eyebrow={t("newsPage.eyebrow")}
        title={t("newsPage.title")}
        description={t("newsPage.desc")}
      />
      <section className="bg-white py-12 sm:py-16">
        <Suspense fallback={<EditorialSkeleton />}>
          <NewsFeed />
        </Suspense>
      </section>
    </>
  );
}