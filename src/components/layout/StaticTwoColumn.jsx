export default function StaticTwoColumn({ column1, column2 }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-[var(--global-margin)]">
      <div className="flex flex-col justify-center gap-6">{column1}</div>
      <div className="flex flex-col justify-center gap-6">{column2}</div>
    </section>
  );
}
