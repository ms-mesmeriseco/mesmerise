export default function SmallTitle({ children }) {
  return (
    <div className="flex items-center gap-4 border-b border-[var(--mesm-grey-dk)] mb-2">
      <h6>{children}</h6>
    </div>
  );
}
