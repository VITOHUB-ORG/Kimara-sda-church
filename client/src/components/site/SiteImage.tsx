import Image from "next/image";

interface SiteImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Focal point for cropping, e.g. "center", "top", "50% 30%". */
  objectPosition?: string;
}

/**
 * Optimized image rendering. The parent must be a sized/relative frame
 * (e.g. `relative aspect-[16/9] w-full overflow-hidden`). Next.js fills
 * that frame with object-fit: cover so images crop to the aspect ratio
 * without distortion, and lazy-loads off-screen images for performance.
 */
export default function SiteImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  objectPosition = "center",
}: SiteImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      className={`object-cover ${className ?? ""}`}
      style={{ objectPosition }}
    />
  );
}
