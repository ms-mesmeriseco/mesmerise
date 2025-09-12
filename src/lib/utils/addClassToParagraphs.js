import React from "react";

/**
 * Add a className to specific elements in a rendered React tree.
 *
 * @param {React.ReactNode} node - rendered tree
 * @param {string} className - class to append (default: "p2")
 * @param {"string" | string[] | (el: React.ReactElement) => boolean} target - which to match
 *    - "p" -> only <p>
 *    - ["p","li"] -> any of these tags
 *    - (el) => boolean -> custom predicate
 */
export default function addClassToParagraphs(
  node,
  className = "p2",
  target = "p"
) {
  const matches = (el) => {
    // DOM tags are strings in React (e.g. 'p', 'li'); components are functions/objects.
    if (typeof target === "function") return target(el);
    if (Array.isArray(target))
      return typeof el.type === "string" && target.includes(el.type);
    return typeof el.type === "string" && el.type === target; // string tag
  };

  const map = (n) => {
    if (n == null || typeof n !== "object") return n;
    if (Array.isArray(n)) return n.map(map);
    if (!React.isValidElement(n)) return n;

    // Recurse
    const oldChildren = n.props?.children;
    const newChildren = map(oldChildren);

    // If this node matches, append the class
    let nextProps = {};
    if (newChildren !== oldChildren) nextProps.children = newChildren;

    if (matches(n)) {
      const prev = n.props?.className || "";
      nextProps.className = `${prev} ${className}`.trim();
    }

    // Only clone when something actually changed
    return Object.keys(nextProps).length ? React.cloneElement(n, nextProps) : n;
  };

  return map(node);
}
