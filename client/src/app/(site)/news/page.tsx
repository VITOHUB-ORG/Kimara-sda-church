import { Suspense } from "react";
import { getI18n } from "@/lib/i18n/server";
import PageHeader from "@/components/site/PageHeader";
import ReadingsFeed from "@/components/site/ReadingsFeed";
import EditorialSkeleton from "@/components/site/EditorialSkeleton";

export const metadata = {
  title: "Daily Lessons",
  description:
    "Daily Bible study guides (Lesoni), youth lessons (Bobea) and morning devotionals (Kesha la Asubuhi) to help you grow in faith.",
};

export default async function ReadingsPage() {
  const { t } = await getI18n();

  return (
    <>
      <PageHeader
        eyebrow={t("readings.eyebrow")}
        title={t("readings.title")}
        description={t("readings.desc")}
      />
      <section className="bg-white py-14 sm:py-20">
        <Suspense fallback={<EditorialSkeleton />}>
          <ReadingsFeed />
        </Suspense>
      </section>
    </>
  );
}