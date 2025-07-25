"use client";

export default function BlogTOC({ anchors }) {
  function handleAnchorClick(e, id) {
    e.preventDefault();
    const headerHeight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height"
        )
      ) || 64;
    const el = document.getElementById(id);
    if (el) {
      const y =
        el.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }

  if (!anchors?.length) return null;

  return (
    <nav className="flex flex-col gap-2 p-4 w-fit self-start mx-0 mb-8">
      <span className="">
        <h6>CONTENTS</h6>
      </span>
      {anchors.map((anchor) => (
        <div
          key={anchor.id}
          className="border-[var(--mesm-grey-dk)] border-1 rounded-xl px-4 py-2 text-left text-sm text-[var(--foreground)] hover:text-[var(--background)] hover:bg-[var(--foreground)] duration-200 flex flex-row items-start gap-2"
        >
          <div className="w-[8px] h-[8px] text-[var(--foreground)] border-[var(--mesm-grey)] border-1 p-[4px] m-[4px] rounded-full bg-black"></div>
          <a
            href={`#${anchor.id}`}
            onClick={(e) => handleAnchorClick(e, anchor.id)}
          >
            {anchor.text}
          </a>
        </div>
      ))}
    </nav>
  );
}
