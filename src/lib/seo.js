export const DEFAULT_OG_IMAGE_URL =
  "https://www.mesmeriseco.com/assets/social-default.png";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.mesmeriseco.com";

export function absoluteUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}
