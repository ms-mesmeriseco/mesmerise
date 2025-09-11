import React from "react";

export default function addClassToParagraphs(node, className = "p2") {
  const map = (n) => {
    if (n == null || typeof n !== "object") return n;
    if (Array.isArray(n)) return n.map(map);

    // If this node is a <p>, append the class
    if (n.type === "p") {
      const prev = n.props?.className || "";
      return React.cloneElement(
        n,
        { className: `${prev} ${className}`.trim() },
        map(n.props?.children)
      );
    }

    // Recurse into children for any other element
    if (n.props?.children) {
      return React.cloneElement(n, {}, map(n.props.children));
    }

    return n;
  };

  return map(node);
}
