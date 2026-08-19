import EditorialFeed, { type EditorialItem } from "./EditorialFeed";
import { EditorialEmpty, EditorialErrorState } from "./EditorialState";

interface EditorialFeedContainerProps {
  fetchItems: () => Promise<EditorialItem[]>;
  viewAction: string;
  recentHeading: string;
  emptyTitle: string;
  emptyDescription?: string;
  errorTitle: string;
  retryLabel: string;
  icon: "event" | "news";
}

/**
 * Fetches editorial items and renders the featured + recent layout, with
 * friendly error and empty states. Wrapped in a <Suspense> boundary by the
 * page so a skeleton shows while the data is loading.
 */
export default async function EditorialFeedContainer({
  fetchItems,
  viewAction,
  recentHeading,
  emptyTitle,
  emptyDescription,
  errorTitle,
  retryLabel,
  icon,
}: EditorialFeedContainerProps) {
  let items: EditorialItem[] = [];
  let failed = false;

  try {
    items = await fetchItems();
  } catch {
    failed = true;
  }

  if (failed) {
    return <EditorialErrorState message={errorTitle} retryLabel={retryLabel} />;
  }

  if (items.length === 0) {
    return (
      <EditorialEmpty message={emptyTitle} description={emptyDescription} icon={icon} />
    );
  }

  return <EditorialFeed items={items} viewAction={viewAction} recentHeading={recentHeading} />;
}