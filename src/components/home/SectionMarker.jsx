export default function SectionMarker({ label }) {
  return (
    <span className="fixed right-5 top-1/2 -translate-y-1/2 rotate-90 origin-bottom-right 
                     text-sm tracking-widest uppercase pointer-events-none z-50">
      <h6>{label}</h6>
    </span>
  );
}
