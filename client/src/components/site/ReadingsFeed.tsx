import { apiGet, type Paginated } from "@/lib/api";
import { getI18n } from "@/lib/i18n/server";
import type { NewsItem } from "@/lib/types";
import { READING_TYPES } from "@/lib/readings";
import LessonsFeedView from "./LessonsFeedView";
import LessonsClientLoader from "./LessonsClientLoader";

/**
 * Server-rendered daily lessons feed. If the server-side API call fails or
 * returns nothing (e.g. the API host is unreachable from the serverless
 * function), it gracefully hands over to a client component that loads the
 * lessons from the browser instead — so the page never shows a scary error.
 */
export default async function ReadingsFeed() {
  const { t } = await getI18n();
  const data = await apiGet<Paginated<NewsItem>>(
    "/api/public/news?limit=100&sort=-lessonDate"
  ).catch(() => null);
  const items = (data?.items ?? []).filter(
    (i) =>
      i.published !== false && READING_TYPES.some((r) => r.value === i.type)
  );

  if (items.length === 0) return <LessonsClientLoader />;

  return <LessonsFeedView items={items} t={t} />;
}