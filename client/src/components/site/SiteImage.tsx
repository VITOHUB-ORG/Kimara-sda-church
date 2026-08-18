import Image from "next/image";
import type { SyntheticEvent } from "react";
import { normalizeImageSrc } from "@/lib/api";

interface SiteImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Focal point for cropping, e.g. "center", "top", "50% 30%". */
  objectPosition?: string;
  /** "cover" fills the frame (crops), "contain" shows the whole image. */
  fit?: "cover" | "contain";
  onLoad?: (e: SyntheticEvent<HTMLImageElement>) => void;
}

/**
 * Optimized image rendering. The parent must be a sized/relative frame
 * (e.g. `relative aspect-[16/9] w-full overflow-hidden`). Next.js fills
 * that frame and lazy-loads off-screen images for performance.
 */
export default function SiteImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  objectPosition = "center",
  fit = "cover",
  onLoad,
}: SiteImageProps) {
  const normalized = normalizeImageSrc(src);
  return (
    <Image
      src={normalized}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      onLoad={onLoad}
      className={`${fit === "contain" ? "object-contain" : "object-cover"} ${className ?? ""}`}
      style={{ objectPosition }}
    />
  );
}
