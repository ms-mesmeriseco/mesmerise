export default function ProjectScroll() {
  return (
    <section data-marker="work" className="h-[400px] flex items-center overflow-x-auto scroll-smooth snap-x snap-mandatory gap-[var(--global-margin)]">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-yellow-300 shrink-0 snap-start rounded-md hover:scale-103 ease-in-out duration-200"
          style={{ width: "30vw", aspectRatio: "6/4" }}
        />
      ))}
    </section>
  );
}
