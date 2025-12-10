// heroUtils.js (Sanity-only)

/**
 * Decode basic HTML entities (for iframe strings stored as text)
 */
export function decodeEntities(str = "") {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/**
 * Extract the first <iframe>...</iframe> from a string
 */
export function extractIframe(html = "") {
  const match = html.match(/<iframe[^>]*>[\s\S]*?<\/iframe>/i);
  return match ? match[0] : "";
}

/**
 * Given Sanity Portable Text blocks (like your hE array),
 * find the first child span that contains an iframe string,
 * decode it and return just the iframe HTML.
 */
export function extractIframeFromBlocks(blocks) {
  if (!Array.isArray(blocks)) return null;

  for (const block of blocks) {
    const children = block?.children || [];
    for (const child of children) {
      const raw = child?.text || "";
      if (!raw) continue;

      const looksLikeIframe =
        raw.includes("<iframe") || raw.includes("&lt;iframe");

      if (!looksLikeIframe) continue;

      const decoded = decodeEntities(raw);
      const iframe = extractIframe(decoded || raw);
      if (iframe) return iframe;
    }
  }

  return null;
}

/**
 * Turn Sanity Portable Text blocks into plain strings for heroL pill list.
 * Assumes heroL is either:
 * - array of blocks
 * - array of strings
 * - single string
 */
export function blocksToStringsPT(blocks) {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .filter((b) => b && b._type === "block")
    .map((b) =>
      (b.children || [])
        .map((ch) => ch.text || "")
        .join("")
        .trim()
    )
    .filter(Boolean);
}

/**
 * Unified helper for heroL → string[]
 */
export function listFromHeroL(heroL) {
  if (!heroL) return [];

  // 1) heroL as array
  if (Array.isArray(heroL)) {
    // already plain strings?
    if (typeof heroL[0] === "string") return heroL;

    // sanity blocks
    if (heroL[0]?._type === "block") {
      return blocksToStringsPT(heroL);
    }

    // fallback: stringify
    return heroL.map((item) => String(item));
  }

  // 2) single string
  if (typeof heroL === "string") {
    return [heroL];
  }

  // 3) fallback
  return [];
}
