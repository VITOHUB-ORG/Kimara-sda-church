import { apiGet, type Paginated } from "@/lib/api";
import type { Event } from "@/lib/types";
import { getI18n } from "@/lib/i18n/server";
import PageHeader from "@/components/site/PageHeader";
import EventCard from "@/components/site/EventCard";

export const metadata = {
  title: "Events",
  description:
    "Upcoming events and programs of the SDA Youth Ministry — conferences, camps, retreats and more.",
};

async function getEvents() {
  return apiGet<Paginated<Event>>("/api/public/events?limit=50&sort=startDate").catch(
    () => ({ items: [] as Event[], total: 0, page: 1, pages: 1 })
  );
}

export default async function EventsPage() {
  const data = await getEvents();
  const { t } = await getI18n();

  return (
    <>
      <PageHeader
        eyebrow={t("eventsPage.eyebrow")}
        title={t("eventsPage.title")}
        description={t("eventsPage.desc")}
      />
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {data.items.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.items.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              {t("eventsPage.noEvents")}
            </p>
          )}
        </div>
      </section>
    </>
  );
}