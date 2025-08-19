export default function StaticTwoColumn({ column, label }) {
  return (
    <section
      className={"wrapper gap-[var(--global-margin-lg)]"}
      data-marker={label}
    >
      <div className="flex flex-col justify-center gap-6"></div>
      <div className="flex flex-col justify-center gap-6">{column}</div>
      <div className="flex flex-col justify-center gap-6"></div>
    </section>
  );
}
