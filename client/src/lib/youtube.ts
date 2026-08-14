const YOUTUBE_REGEX =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(YOUTUBE_REGEX);
  return match ? match[1] : null;
}

export function getYouTubeThumbnail(url: string): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  // Google's free image CDN — maxresdefault falls back gracefully to hqdefault
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

export function getYouTubeEmbed(url: string): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}`;
}

export function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  // Matches watch/live/embed links AND channel/handle URLs (e.g. @KimaraYouthMinistry)
  return /(?:youtube\.com|youtu\.be)/i.test(url);
}
