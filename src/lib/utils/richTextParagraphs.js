/** Convert Contentful Rich Text JSON to an array of paragraph strings.
 *  - Keeps paragraph boundaries
 *  - Treats headings & list items as paragraphs
 *  - Strips inline marks/links but preserves their text
 */
export default function richTextParagraphs(doc) {
  const out = [];

  const push = (s) => {
    const t = (s || "").replace(/\s+/g, " ").trim();
    if (t) out.push(t);
  };

  const walk = (node) => {
    if (!node) return "";

    const type = node.nodeType;
    const children = node.content || [];

    switch (type) {
      case "text":
        return node.value || "";

      case "paragraph": {
        const txt = children.map(walk).join("");
        push(txt);
        return "";
      }

      // Treat headings as individual paragraphs too
      case "heading-1":
      case "heading-2":
      case "heading-3":
      case "heading-4":
      case "heading-5":
      case "heading-6": {
        const txt = children.map(walk).join("");
        push(txt);
        return "";
      }

      // Lists: one paragraph per list-item (joined lines also work)
      case "unordered-list":
      case "ordered-list": {
        children.forEach((li) => {
          const line = walk(li);
          if (line) push(line);
        });
        return "";
      }

      case "list-item": {
        // list-items can contain paragraphs/spans; flatten their text
        const txt = children.map(walk).join("");
        return txt;
      }

      // Inline nodes: just bubble up their text
      case "hyperlink":
      case "embedded-entry-inline":
      case "embedded-asset-inline": {
        return children.map(walk).join("");
      }

      // Blocks we don’t explicitly format as their own paragraph:
      // return concatenated text so parent can decide.
      case "blockquote":
      case "hr":
      case "embedded-entry-block":
      case "embedded-asset-block":
      default:
        return children.map(walk).join("");
    }
  };

  walk(doc);
  return out;
}
