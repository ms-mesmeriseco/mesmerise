// components/blog/BlogServiceTags.jsx
"use client";

import ServiceTags from "@/components/services/ServiceTags";

export default function BlogServiceTags({
  tags = [],
  max = 3,
  showEllipsis = true,
  clickable = false,
}) {
  const cleaned = (tags || [])
    .map((t) => (typeof t === "string" ? { title: t, slug: t } : t))
    .filter((t) => t?.title);

  if (cleaned.length === 0) return null;

  const visible = cleaned.slice(0, max);
  const hasMore = cleaned.length > max;

  // NOTE: your ServiceTags supports both strings and objects.
  // We pass objects if clickable so it can route using slug.
  const items = clickable ? visible : visible.map((t) => t.title);

  return (
    <div className="pointer-events-none">
      <ServiceTags
        items={hasMore && showEllipsis ? [...items, "..."] : items}
        large={false}
        clickable={clickable}
        highlight={true}
      />
    </div>
  );
}
