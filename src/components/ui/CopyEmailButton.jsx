"use client";

import { useEffect, useRef, useState } from "react";

function CopyEmailButton({
  email = "hello@mesmeriseco.com",
  label = "Email",
  className = "",
}) {
  const [toast, setToast] = useState(null); // { x, y, text }
  const hideRef = useRef(null);

  async function handleClick(e) {
    e.preventDefault();

    const x = e.clientX || window.innerWidth / 2;
    const y = e.clientY || window.innerHeight - 80;

    // Try modern Clipboard API
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = email;
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
      } finally {
        document.body.removeChild(ta);
      }
    }

    setToast({ x, y, text: "Copied to clipboard" }); // change to "Copied to keyboard" if you prefer

    clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => setToast(null), 1200);
  }

  useEffect(() => () => clearTimeout(hideRef.current), []);

  return (
    <>
      <button
        onClick={handleClick}
        className={[
          "w-full h-full md:text-4xl text-2xl font-normal text-left p-[var(--global-margin-sm)] flex-start flex",
          className,
        ].join(" ")}
        aria-label={`Copy ${email} to clipboard`}
      >
        {label}
        <br />
        {email}
      </button>

      {/* Screen reader announcement */}
      <span aria-live="polite" className="sr-only">
        {toast ? toast.text : ""}
      </span>

      {/* Tiny toast at cursor */}
      {toast && (
        <div
          className="fixed z-[9999] pointer-events-none select-none
                     px-3 py-1 rounded-md shadow-lg text-sm
                     bg-[var(--mesm-red)] text-[var(--background)]
                     transition-opacity duration-200 "
          style={{
            left: toast.x,
            top: toast.y,
            transform: "translate(-50%, -120%)",
          }}
        >
          {toast.text}
        </div>
      )}
    </>
  );
}

export default CopyEmailButton;
