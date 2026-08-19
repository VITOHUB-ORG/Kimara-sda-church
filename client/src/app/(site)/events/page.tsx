import { Suspense } from "react";
import { getI18n } from "@/lib/i18n/server";
import PageHeader from "@/components/site/PageHeader";
import EventsFeed from "@/components/site/EventsFeed";
import EditorialSkeleton from "@/components/site/EditorialSkeleton";

export const metadata = {
  title: "Events",
  description:
    "Upcoming events and programs of the SDA Youth Ministry — conferences, camps, retreats and more.",
};

export default async function EventsPage() {
  const { t } = await getI18n();

  return (
    <>
      <PageHeader
        eyebrow={t("eventsPage.eyebrow")}
        title={t("eventsPage.title")}
        description={t("eventsPage.desc")}
      />
      <section className="bg-white py-12 sm:py-16">
        <Suspense fallback={<EditorialSkeleton />}>
          <EventsFeed />
        </Suspense>
      </section>
    </>
  );
}