// "You're not sure..." + "Prospects push back..." → "You're not sure..., and prospects push back..."
// Used by the Growth Leak and CMO results pages and the CMO PDF
export function joinTold(lines) {
  const parts = lines.map(
    (l) => l.charAt(0).toLowerCase() + l.slice(1).replace(/\.$/, ""),
  );
  const sentence = `${parts.join(", and ")}.`;
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}
