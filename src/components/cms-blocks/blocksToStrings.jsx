export default function blocksToStrings(blocks) {
  if (!Array.isArray(blocks)) return [];

  return blocks
    .filter((block) => block && block._type === "block")
    .map((block) => {
      if (!Array.isArray(block.children)) return "";
      return block.children.map((child) => child.text || "").join("");
    });
}
