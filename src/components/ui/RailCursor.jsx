"use client";

// The NEXT / BACK circle is drawn by the global cursor (CustomCursor.jsx).
// This wrapper just marks the area so the cursor morphs into it.
export default function RailCursor({ children, className, style, ...props }) {
  return (
    <div
      data-cursor="rail"
      style={{ position: "relative", ...style }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}
