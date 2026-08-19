import EditorialFeedContainer from "./EditorialFeedContainer";
import { formatEditorialDate } from "@/lib/editorial";
import { getI18n } from "@/lib/i18n/server";
import { apiGet, type Paginated } from "@/lib/api";
import type { NewsItem } from "@/lib/types";
import type { EditorialItem } from "./EditorialFeed";

const toItem = (item: NewsItem): EditorialItem => ({
  href: `/news/${item.slug || item._id}`,
  title: item.title,
  excerpt: item.excerpt,
  image: item.image || undefined,
  category: item.category || undefined,
  dateLabel: formatEditorialDate(item.createdAt),
  dateIso: item.createdAt,
  icon: "news",
});

/**
 * Latest published news, newest first. The most recently published item
 * automatically becomes the featured story.
 */
export default async function NewsFeed() {
  const { t } = await getI18n();
  return (
    <EditorialFeedContainer
      fetchItems={async () => {
        const data = await apiGet<Paginated<NewsItem>>("/api/public/news?limit=50");
        return data.items.map(toItem);
      }}
      viewAction={t("common.readMore")}
      recentHeading={t("newsPage.recentNews")}
      emptyTitle={t("newsPage.emptyTitle")}
      emptyDescription={t("newsPage.emptyDesc")}
      errorTitle={t("newsPage.errorTitle")}
      retryLabel={t("common.tryAgain")}
      icon="news"
    />
  );
}