export default function HeaderLarge({ text }) {
  return (
    <div className="flex justify-start items-end h-[30vh] border-b-1 border-[var(--foreground)]">
      <h1 className="text-9xl font-normal">{text}</h1>
    </div>
  );
}
