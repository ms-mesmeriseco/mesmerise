"use client";

// Hero eyebrow pill. `as` sets the semantic tag (e.g. "h1" when the eyebrow is the
// page's main heading); font sizing is explicit so it looks the same whatever the tag.
export default function StarEyebrow({ children, as: Tag = "h5", className = "" }) {
  return (
    <Tag
      className={["star-eyebrow text-left", className].join(" ")}
    >
      <span className="star-eyebrow-label">{children}</span>
    </Tag>
  );
}
