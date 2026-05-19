/** Normalize an Instagram post/reel URL to a canonical permalink for embeds. */
export function normalizeInstagramEmbedUrl(url: string): string | null {
  const trimmed = url.trim();
  const match = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(p|reel)\/([A-Za-z0-9_-]+)/i,
  );
  if (!match) return null;
  const [, type, shortcode] = match;
  return `https://www.instagram.com/${type}/${shortcode}/`;
}

export function isValidInstagramEmbedUrl(url: string): boolean {
  return normalizeInstagramEmbedUrl(url) !== null;
}
