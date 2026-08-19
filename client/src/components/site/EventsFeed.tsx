import EditorialFeedContainer from "./EditorialFeedContainer";
import { getEventImage, formatEditorialDate } from "@/lib/editorial";
import { ministryMeta } from "@/lib/ministries";
import { getI18n } from "@/lib/i18n/server";
import { type TFunction } from "@/lib/i18n/shared";
import { apiGet, type Paginated } from "@/lib/api";
import type { Event } from "@/lib/types";
import type { EditorialItem } from "./EditorialFeed";

const toItem = (event: Event, t: TFunction): EditorialItem => ({
  href: `/events/${event.slug || event._id}`,
  title: event.title,
  excerpt: event.description,
  image: getEventImage(event) || undefined,
  category:
    event.ministry !== "general"
      ? ministryMeta[event.ministry].label
      : t("eventsPage.churchEvent"),
  dateLabel: formatEditorialDate(event.startDate),
  dateIso: event.startDate,
  meta: event.location || undefined,
  badge: new Date(event.startDate).getTime() > Date.now() ? t("common.upcoming") : undefined,
  icon: "event",
});

/**
 * Latest published events, newest first. The most recently created event
 * automatically becomes the featured story — no manual selection.
 */
export default async function EventsFeed() {
  const { t } = await getI18n();
  return (
    <EditorialFeedContainer
      fetchItems={async () => {
        const data = await apiGet<Paginated<Event>>("/api/public/events?limit=50&sort=-createdAt");
        return data.items.map((e) => toItem(e, t));
      }}
      viewAction={t("eventsPage.viewEvent")}
      recentHeading={t("eventsPage.recentEvents")}
      emptyTitle={t("eventsPage.emptyTitle")}
      emptyDescription={t("eventsPage.emptyDesc")}
      errorTitle={t("eventsPage.errorTitle")}
      retryLabel={t("common.tryAgain")}
      icon="event"
    />
  );
}