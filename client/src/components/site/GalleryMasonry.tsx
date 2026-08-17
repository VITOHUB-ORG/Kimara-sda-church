"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/types";
import { normalizeImageSrc } from "@/lib/api";

const categoryMeta: Record<string, { label: string; hex: string }> = {
  worship: { label: "Worship", hex: "#1D4E89" },
  fellowship: { label: "Fellowship", hex: "#26828E" },
  service: { label: "Service", hex: "#3A7D44" },
  mission: { label: "Mission", hex: "#8E3B46" },
  leadership: { label: "Leadership", hex: "#D9A441" },
};

function itemImages(item: GalleryItem): string[] {
  const images = (item.images ?? []).filter(Boolean);
  return images.length > 0 ? images : item.image ? [item.image] : [];
}

interface LightboxState {
  item: GalleryItem;
  images: string[];
  index: number;
}

export default function GalleryMasonry({ items }: { items: GalleryItem[] }) {
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const touchX = useRef<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);

  const step = useCallback(
    (dir: number) => {
      setLightbox((lb) => {
        if (!lb) return null;
        const count = lb.images.length;
        return { ...lb, index: ((lb.index + dir) % count + count) % count };
      });
    },
    []
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, step]);

  return (
    <>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {items.map((item) => {
          const images = itemImages(item);
          const src = images[0];
          return (
            <figure
              key={item._id}
              className="group mb-5 break-inside-avoid overflow-hidden rounded-2xl bg-navy-100/40 shadow-sm"
            >
              <button
                type="button"
                onClick={() => setLightbox({ item, images, index: 0 })}
                className="relative block w-full cursor-pointer overflow-hidden text-left"
                aria-label={`Open ${item.title || item.caption || "photo"} in viewer`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={normalizeImageSrc(src)}
                  alt={item.title || item.caption || "Gallery image"}
                  loading="lazy"
                  className="w-full transition-transform duration-300 group-hover:scale-105"
                />
                {images.length > 1 && (
                  <span className="absolute right-3 top-3 rounded-full bg-navy-950/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
                    {images.length} photos
                  </span>
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute bottom-3 right-3 rounded-full bg-gold-500 px-3 py-1.5 text-xs font-bold text-navy-900 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  View
                </span>
              </button>
              <figcaption className="flex flex-wrap items-center justify-between gap-2 px-4 py-3.5">
                <span className="text-sm font-semibold text-navy-900">
                  {item.title || item.caption || "Youth Ministry"}
                </span>
                {item.category && (
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
                    style={{ backgroundColor: categoryMeta[item.category]?.hex ?? "#12355B" }}
                  >
                    {categoryMeta[item.category]?.label ?? item.category}
                  </span>
                )}
              </figcaption>
            </figure>
          );
        })}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[60] flex flex-col bg-navy-950/95 backdrop-blur"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={close}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6">
            <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-gold-400">
              {lightbox.item.title || lightbox.item.caption || "Photo"}
            </p>
            <button
              type="button"
              onClick={close}
              className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close viewer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-16" onClick={(e) => e.stopPropagation()}>
            <div className="relative flex max-h-full w-full items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={lightbox.images[lightbox.index]}
                src={normalizeImageSrc(lightbox.images[lightbox.index])}
                alt={`${lightbox.item.title || "Gallery image"} ${lightbox.index + 1}`}
                className="max-h-[72vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
              />
              {lightbox.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition-colors hover:bg-gold-500 hover:text-navy-900 sm:left-4"
                    aria-label="Previous photo"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur transition-colors hover:bg-gold-500 hover:text-navy-900 sm:right-4"
                    aria-label="Next photo"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                    {lightbox.index + 1} / {lightbox.images.length}
                  </span>
                </>
              )}
            </div>
          </div>

          {lightbox.item.caption && (
            <p className="border-t border-white/10 px-4 py-3 text-center text-sm text-white/80 sm:px-6">
              {lightbox.item.caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
