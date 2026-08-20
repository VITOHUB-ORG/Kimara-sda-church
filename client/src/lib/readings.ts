import type { TFunction } from "@/lib/i18n/shared";

export type ReadingType = "lesoni" | "bobea" | "kesha";

export interface ReadingMeta {
  value: ReadingType;
  /** i18n key that resolves to the human label (see `readings.*` in dictionaries). */
  labelKey: string;
  /** Tailwind badge classes for the pill shown on cards. */
  badge: string;
  /** Tailwind top-border accent used to tie cards of the same category together. */
  bar: string;
  /** Accent color dot/underline used in section headings. */
  dot: string;
}

export const READING_TYPES: ReadingMeta[] = [
  {
    value: "lesoni",
    labelKey: "readings.lesoni",
    badge: "bg-blue-100 text-blue-800",
    bar: "border-t-blue-600",
    dot: "bg-blue-600",
  },
  {
    value: "bobea",
    labelKey: "readings.bobea",
    badge: "bg-purple-100 text-purple-800",
    bar: "border-t-purple-600",
    dot: "bg-purple-600",
  },
  {
    value: "kesha",
    labelKey: "readings.kesha",
    badge: "bg-gold-100 text-gold-700",
    bar: "border-t-gold-500",
    dot: "bg-gold-500",
  },
];

export const readingMeta = (type?: string): ReadingMeta | undefined =>
  READING_TYPES.find((r) => r.value === type);

export const isReadingType = (type?: string): boolean =>
  READING_TYPES.some((r) => r.value === type);

/** Translated label for a lesson: uses `type` when known, else the legacy category text. */
export const readingLabel = (
  t: TFunction,
  type?: string,
  category?: string
): string => {
  const meta = readingMeta(type);
  if (meta) return t(meta.labelKey);
  return category || t("readings.title");
};

/** Estimated reading time in minutes (English ~200 wpm, Swahili ~180 wpm). */
export const readingMinutes = (content: string): number => {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 190));
};