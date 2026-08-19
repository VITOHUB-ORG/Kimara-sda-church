"use client";

import { useI18n } from "@/lib/i18n/client";
import { EditorialErrorState } from "@/components/site/EditorialState";

export default function EventsError({ reset }: { error: Error; reset: () => void }) {
  const { t } = useI18n();
  return (
    <section className="bg-white py-12 sm:py-16">
      <EditorialErrorState
        message={t("eventsPage.errorTitle")}
        retryLabel={t("common.tryAgain")}
        onRetry={reset}
      />
    </section>
  );
}