"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SyntheticEvent } from "react";
import SiteImage from "./SiteImage";

export interface CarouselSlide {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
}

interface ImageCarouselProps {
  slides: CarouselSlide[];
  /** Fallback aspect ratio (width/height) used until each image's real size is known. */
  aspect?: number;
  autoPlay?: boolean;
  interval?: number;
}

/** Keep the frame sane for extreme image shapes (very tall / very wide). */
const MIN_RATIO = 0.75;
const MAX_RATIO = 2.2;

export default function ImageCarousel({
  slides,
  aspect = 1.5,
  autoPlay = true,
  interval = 5000,
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ratios, setRatios] = useState<(number | null)[]>(() => slides.map(() => null));
  const touchX = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = slides.length;
  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (!autoPlay || count <= 1 || paused) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [autoPlay, count, interval, paused, index]);

  if (count === 0) return null;

  const rawRatio = ratios[index] ?? aspect;
  const frameRatio = Math.min(MAX_RATIO, Math.max(MIN_RATIO, rawRatio));

  const captureRatio = (i: number) => (e: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (!naturalWidth || !naturalHeight) return;
    const ratio = naturalWidth / naturalHeight;
    setRatios((prev) => {
      if (prev[i] === ratio) return prev;
      const next = [...prev];
      next[i] = ratio;
      return next;
    });
  };

  return (
    <div
      className="group relative overflow-hidden rounded-3xl shadow-lg"
      style={{
        background:
          "radial-gradient(120% 130% at 50% 20%, #182c47 0%, #0f1b30 55%, #070c16 100%)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        touchX.current = null;
      }}
      role="region"
      aria-label="Photo carousel"
    >
      <div className="relative w-full" style={{ aspectRatio: `${frameRatio}`, transition: "aspect-ratio 0.6s ease" }}>
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="relative h-full w-full shrink-0">
              <SiteImage
                src={slide.src}
                alt={slide.alt}
                fit="contain"
                onLoad={captureRatio(i)}
                sizes="(max-width: 768px) 100vw, 90vw"
                priority={i === 0}
                className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              {(slide.title || slide.caption) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/85 via-navy-950/40 to-transparent px-6 pb-5 pt-14 sm:px-8 sm:pb-6">
                  {slide.title && (
                    <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-gold-400">
                      {slide.title}
                    </p>
                  )}
                  {slide.caption && (
                    <p className="mt-1 max-w-2xl text-sm text-white sm:text-base">{slide.caption}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-navy-950/60 p-2.5 text-white backdrop-blur transition-colors hover:bg-gold-500 hover:text-navy-900"
              aria-label="Previous photo"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-navy-950/60 p-2.5 text-white backdrop-blur transition-colors hover:bg-gold-500 hover:text-navy-900"
              aria-label="Next photo"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <div className="absolute bottom-3 right-4 z-10 flex items-center gap-2 rounded-full bg-navy-950/60 px-3 py-1.5 backdrop-blur sm:bottom-4">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-gold-500" : "w-2 bg-white/60 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}