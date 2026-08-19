import type { Event } from "./types";
import { getYouTubeThumbnail } from "./youtube";

/** Human-friendly date, e.g. "19 Aug 2026". */
export function formatEditorialDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Cover image for an event: uploaded image, else the YouTube thumbnail. */
export function getEventImage(event: Event): string {
  return event.image || getYouTubeThumbnail(event.youtubeUrl) || "";
}