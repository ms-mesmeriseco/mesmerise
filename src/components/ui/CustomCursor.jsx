"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

/*
 * Global desktop cursor.
 *
 * The cursor works out its state from the element under the pointer:
 *   - data-cursor="rail"    → big red NEXT / BACK circle (side decided by pointer x)
 *   - data-cursor="hero"    → hides; HeroButton draws its own clipped circle
 *                             using the same spring position (see useCursor)
 *   - data-cursor="link"    → small dot (also any a / button / label / .cursor-pointer)
 *   - data-cursor="default" → opt an element out of the link state
 *   - data-cursor="hidden"  → hide the custom cursor
 *   - text inputs           → hidden, native text caret shows
 * The nearest matching ancestor wins, so a button inside the rail is "link".
 */

export const CURSOR_SIZE = 16;
const SPRING = { damping: 30, stiffness: 700, mass: 0.2 };

const WHITE = "rgb(255, 255, 255)";
const RED = "hsl(13, 100%, 50%)"; // --mesm-red (literal so it can tween)

const VARIANTS = {
  default: { width: CURSOR_SIZE, height: CURSOR_SIZE, opacity: 1, backgroundColor: WHITE },
  link: { width: 8, height: 8, opacity: 1, backgroundColor: WHITE },
  rail: { width: 85, height: 85, opacity: 1, backgroundColor: RED },
  hero: { width: CURSOR_SIZE, height: CURSOR_SIZE, opacity: 0, backgroundColor: WHITE },
  hidden: { width: CURSOR_SIZE, height: CURSOR_SIZE, opacity: 0, backgroundColor: WHITE },
};

const INTERACTIVE =
  'a[href], button, [role="button"], label, select, summary, input, textarea, [contenteditable="true"], [data-cursor]';
const TEXT_INPUT =
  'textarea, [contenteditable="true"], input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="range"]):not([type="file"]):not([type="color"])';

const CursorContext = createContext({ enabled: false, x: null, y: null });
export const useCursor = () => useContext(CursorContext);

function resolve(target, clientX) {
  if (!(target instanceof Element)) return { variant: "default" };

  const el = target.closest(INTERACTIVE);
  if (el) {
    const explicit = el.getAttribute("data-cursor");
    if (explicit === "rail") {
      const r = el.getBoundingClientRect();
      return {
        variant: "rail",
        label: clientX > r.left + r.width / 2 ? "Next" : "Back",
      };
    }
    if (explicit && VARIANTS[explicit]) return { variant: explicit };
    if (el.matches(TEXT_INPUT)) return { variant: "hidden" };
    if (el.matches(":disabled, [aria-disabled='true']")) return { variant: "default" };
    return { variant: "link" };
  }

  if (target.closest(".cursor-pointer")) return { variant: "link" };
  return { variant: "default" };
}

export default function CursorProvider({ children }) {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [state, setState] = useState({ variant: "default" });

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const x = useSpring(mouseX, SPRING);
  const y = useSpring(mouseY, SPRING);

  const last = useRef({ x: -100, y: -100, seen: false });

  const apply = (target, clientX) => {
    const next = resolve(target, clientX);
    setState((prev) =>
      prev.variant === next.variant && prev.label === next.label ? prev : next,
    );
  };

  // Only on devices with a real hovering pointer
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    let raf = 0;

    const onMove = (e) => {
      if (e.pointerType === "touch") return;
      if (!last.current.seen) {
        // First move: snap into place instead of flying in from the corner
        x.jump(e.clientX);
        y.jump(e.clientY);
        last.current.seen = true;
        root.classList.add("has-custom-cursor");
      }
      last.current.x = e.clientX;
      last.current.y = e.clientY;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
      apply(e.target, e.clientX);
    };

    // Content moves under a still pointer when scrolling — re-check what's below
    const recheck = () => {
      if (!last.current.seen || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const { x: lx, y: ly } = last.current;
        apply(document.elementFromPoint(lx, ly), lx);
      });
    };

    const onOut = (e) => {
      if (!e.relatedTarget) setVisible(false);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", recheck, { passive: true, capture: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseout", onOut);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", recheck, { capture: true });
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseout", onOut);
      root.classList.remove("has-custom-cursor");
      last.current.seen = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // New page content may be under a still pointer after navigation
  useEffect(() => {
    if (!enabled || !last.current.seen) return;
    const id = setTimeout(() => {
      const { x: lx, y: ly } = last.current;
      apply(document.elementFromPoint(lx, ly), lx);
    }, 50);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, enabled]);

  const { variant, label } = state;

  return (
    <CursorContext.Provider value={{ enabled, x, y }}>
      {children}

      {enabled && (
        <motion.div
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            x,
            y,
            zIndex: 2147483647,
            pointerEvents: "none",
            // Difference keeps the dot visible on light and dark sections;
            // the red rail circle needs its true colour.
            mixBlendMode: variant === "rail" ? "normal" : "difference",
            opacity: visible ? 1 : 0,
            transition: "opacity 150ms ease-out",
          }}
        >
          <motion.div
            initial={false}
            animate={{ ...VARIANTS[variant], scale: pressed ? 0.85 : 1 }}
            transition={{ type: "spring", stiffness: 450, damping: 32, mass: 0.6 }}
            style={{
              translateX: "-50%",
              translateY: "-50%",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <AnimatePresence mode="wait">
              {variant === "rail" && (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.1 }}
                  style={{
                    fontSize: 18,
                    fontWeight: 400,
                    letterSpacing: "0.1em",
                    color: "var(--foreground)",
                    textTransform: "uppercase",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </CursorContext.Provider>
  );
}
