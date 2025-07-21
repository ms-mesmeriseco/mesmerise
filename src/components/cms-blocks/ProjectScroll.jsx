export default function ProjectScroll() {
  return (
    <section
      data-marker="work"
      className="grid grid-cols-2 gap-[var(--global-margin-sm)] h-[600px] px-[var(--global-margin-lg)] py-[var(--global-margin-sm)]"
    >
      {/* Column 1 */}
      <div className="flex flex-col gap-[var(--global-margin-sm)] h-full">
        {/* Top row: 1 project */}
        <div className="bg-yellow-300 rounded-md flex-1 hover:scale-101 ease-in-out duration-200" />
        {/* Bottom row: 2 projects side by side */}
        <div className="flex gap-[var(--global-margin-sm)] flex-1">
          <div className="bg-yellow-300 rounded-md flex-1 hover:scale-101 ease-in-out duration-200" />
          <div className="bg-yellow-300 rounded-md flex-1 hover:scale-101 ease-in-out duration-200" />
        </div>
      </div>
      {/* Column 2 */}
      <div className="flex flex-col gap-[var(--global-margin-sm)] h-full">
        {/* Top row: 2 projects side by side */}
        <div className="flex gap-[var(--global-margin-sm)] flex-1">
          <div className="bg-yellow-300 rounded-md flex-1 hover:scale-101 ease-in-out duration-200" />
          <div className="bg-yellow-300 rounded-md flex-1 hover:scale-101 ease-in-out duration-200" />
        </div>
        {/* Bottom row: 1 project */}
        <div className="bg-yellow-300 rounded-md flex-1 hover:scale-101 ease-in-out duration-200" />
      </div>
    </section>
  );
}
