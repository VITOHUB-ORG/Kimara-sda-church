"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/client";
import type { Paginated } from "@/lib/api";
import type { NewsItem } from "@/lib/types";
import LessonsFeedView from "./LessonsFeedView";
import { READING_TYPES } from "@/lib/readings";

async function fetchLessons(signal: AbortSignal): Promise<NewsItem[]> {
  const res = await fetch("/api/public/news?limit=100&sort=-lessonDate", {
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as Paginated<NewsItem>;
  return data.items ?? [];
}

function LessonsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-10">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <div className="flex items-center gap-4 border-b-2 border-navy-100 pb-3">
              <div className="h-16 w-14 rounded-xl bg-navy-100" />
              <div className="space-y-2">
                <div className="h-4 w-56 rounded bg-navy-100" />
                <div className="h-3 w-24 rounded bg-navy-100" />
              </div>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((j) => (
                <div
                  key={j}
                  className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 border-t-4 border-t-gray-200 bg-white shadow-sm"
                >
                  <div className="aspect-[16/9] w-full bg-navy-100" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-24 rounded-full bg-navy-100" />
                    <div className="h-5 w-3/4 rounded bg-navy-100" />
                    <div className="h-3 w-full rounded bg-navy-100" />
                    <div className="h-3 w-2/3 rounded bg-navy-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LessonsClientLoader() {
  const { t } = useI18n();
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    fetchLessons(controller.signal)
      .then((list) => {
        if (active) setItems(list);
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => clearTimeout(timer));
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  const retry = () => {
    setFailed(false);
    setItems(null);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    fetchLessons(controller.signal)
      .then((list) => setItems(list))
      .catch(() => setFailed(true))
      .finally(() => clearTimeout(timer));
  };

  if (failed) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-20 text-center">
          <h2 className="font-display text-lg font-bold text-navy-900">
            {t("newsPage.errorTitle")}
          </h2>
          <button
            type="button"
            onClick={retry}
            className="mt-5 rounded-full bg-navy-900 px-6 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-navy-800"
          >
            {t("common.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  if (!items) return <LessonsSkeleton />;

  const lessons = items.filter(
    (i) => i.published !== false && READING_TYPES.some((r) => r.value === i.type)
  );

  if (lessons.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-lg font-semibold text-navy-900">
          {t("readings.emptyTitle")}
        </p>
        <p className="mt-2 text-gray-500">{t("readings.emptyDesc")}</p>
      </div>
    );
  }

  return <LessonsFeedView items={lessons} t={t} />;
}