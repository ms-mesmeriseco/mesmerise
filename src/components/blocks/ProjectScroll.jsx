export default function ProjectScroll() {
  return (
    <section data-marker="work" className="h-[60vh] flex items-center overflow-x-auto scroll-smooth snap-x snap-mandatory px-[var(--global-margin)]">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-yellow-300 mr-6 shrink-0 snap-start"
          style={{ width: "30vw", aspectRatio: "4/6" }}
        />
      ))}
    </section>
  );
}
