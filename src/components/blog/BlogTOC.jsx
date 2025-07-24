"use client";

export default function BlogTOC({ anchors }) {
  function handleAnchorClick(e, id) {
    e.preventDefault();
    const headerHeight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height"
        )
      ) || 80;
    const el = document.getElementById(id);
    if (el) {
      const y =
        el.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  if (!anchors?.length) return null;

  return (
    <nav className="sticky top-[calc(var(--header-height,80px)+2rem)] left-0 z-40 flex flex-col gap-2 p-4 rounded-xl shadow bg-white/80 w-fit self-start mx-0 mb-8">
      <span className="font-semibold text-[var(--mesm-blue)] mb-2">
        Contents
      </span>
      {anchors.map((anchor) => (
        <a
          key={anchor.id}
          href={`#${anchor.id}`}
          className="text-left text-sm text-[var(--mesm-blue)] hover:underline"
          onClick={(e) => handleAnchorClick(e, anchor.id)}
        >
          {anchor.text}
        </a>
      ))}
    </nav>
  );
}
