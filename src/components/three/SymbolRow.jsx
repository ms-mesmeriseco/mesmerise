"use client";

// The five service symbols side by side in a five-column row. Same glass and
// hover swivel as SymbolRing; click opens the service. On desktop the whole
// column is the hover zone: the service's name floats next to the cursor in a
// boxed tag, tied back to its symbol by a thin line. On mobile the symbols
// stack in a column with their names below.
//
// The camera is orthographic so the outer symbols aren't stretched by
// perspective: every symbol keeps its true shape wherever it sits in the row.

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Html, OrthographicCamera } from "@react-three/drei";
import { MathUtils } from "three";
import {
  SYMBOLS,
  SYMBOL_SIZE,
  FACE_YAW,
  HOVER_TURN,
  MOBILE_BREAKPOINT,
  SymbolGlass,
} from "./SymbolRing";

const FILL = 0.55; // max share of a column each symbol's width fills
const MAX_HEIGHT = 0.3; // max share of the block's height a symbol fills
const CAMERA_ZOOM = 100; // px per world unit (all sizes scale off the viewport)
const CURSOR_OFFSET = 16; // px gap between the cursor and the floating tag
const LINE_GAP = 12; // px between the symbol's edge and the start of its line

function RowSymbol({
  symbol,
  position,
  scale,
  stacked,
  labelY,
  hovered,
  onHover,
  onSelect,
}) {
  const hoverRef = useRef();

  useFrame((_, delta) => {
    const g = hoverRef.current;
    g.rotation.y = MathUtils.damp(
      g.rotation.y,
      FACE_YAW + (hovered ? HOVER_TURN : 0),
      6,
      delta,
    );
  });

  return (
    <group position={position}>
      <group
        ref={hoverRef}
        scale={scale}
        rotation-y={FACE_YAW}
        // Desktop hover comes from the whole column (see SymbolRow)
        onPointerOver={(e) => {
          if (!stacked) return;
          e.stopPropagation();
          onHover(true);
        }}
        onPointerOut={() => stacked && onHover(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <SymbolGlass model={symbol.model} accent={symbol.accent} />
      </group>

      {/* Mobile: no hover, so the name always sits under the symbol */}
      {stacked && (
        <Html
          center
          position={[0, -labelY, 0]}
          style={{ pointerEvents: "none" }}
        >
          <h5 className="whitespace-nowrap">{symbol.title}</h5>
        </Html>
      )}
    </group>
  );
}

function Row({ hoveredIndex, setHoveredIndex, onSelect }) {
  const viewport = useThree((s) => s.viewport);
  const stacked = useThree((s) => s.size.width < MOBILE_BREAKPOINT);
  const n = SYMBOLS.length;

  // Desktop: evenly spaced columns. Mobile: evenly spaced rows.
  const slot = (stacked ? viewport.height : viewport.width) / n;
  const size = stacked
    ? Math.min(slot * 0.55, viewport.width * FILL)
    : Math.min(slot * FILL, viewport.height * MAX_HEIGHT);
  const scale = size / SYMBOL_SIZE;

  const labelY = size / 2 + viewport.height * 0.02;

  return SYMBOLS.map((s, i) => {
    const offset = (i - (n - 1) / 2) * slot;
    return (
      <RowSymbol
        key={s.title}
        symbol={s}
        position={stacked ? [0, -offset, 0] : [offset, 0, 0]}
        scale={scale}
        stacked={stacked}
        labelY={labelY}
        hovered={hoveredIndex === i}
        onHover={(on) =>
          setHoveredIndex((cur) => (on ? i : cur === i ? null : cur))
        }
        onSelect={() => onSelect(s.href)}
      />
    );
  });
}

export default function SymbolRow({ className = "" }) {
  const router = useRouter();
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const lineRef = useRef(null);
  const dotRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [stacked, setStacked] = useState(false);
  // Keep showing the last title while the tag fades out
  const lastTitle = useRef("");
  if (hoveredIndex !== null) lastTitle.current = SYMBOLS[hoveredIndex].title;

  useEffect(() => {
    const check = () =>
      setStacked(sectionRef.current.clientWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Desktop: which column the cursor is in picks the symbol. The tag and its
  // line are moved directly on the DOM so the pointer never re-renders.
  const onPointerMove = (e) => {
    if (stacked) return;
    const box = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const n = SYMBOLS.length;
    const col = Math.min(n - 1, Math.max(0, Math.floor((x / box.width) * n)));
    if (col !== hoveredIndex) setHoveredIndex(col);

    // Tag sits beside the cursor, flipped left if it would leave the block
    const label = labelRef.current;
    const flip = x + CURSOR_OFFSET + label.offsetWidth > box.width;
    const lx = flip ? x - CURSOR_OFFSET - label.offsetWidth : x + CURSOR_OFFSET;
    label.style.transform = `translate3d(${lx}px, ${y + CURSOR_OFFSET}px, 0)`;

    // Line from the symbol's edge (same size maths as Row, in px) to the cursor
    const colW = box.width / n;
    const cx = (col + 0.5) * colW;
    const cy = box.height / 2;
    const r = Math.min(colW * FILL, box.height * MAX_HEIGHT) / 2 + LINE_GAP;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.hypot(dx, dy);
    const line = lineRef.current;
    const show = dist > r;
    line.style.opacity = show ? "" : "0";
    if (show) {
      line.setAttribute("x1", cx + (dx / dist) * r);
      line.setAttribute("y1", cy + (dy / dist) * r);
    }
    line.setAttribute("x2", x);
    line.setAttribute("y2", y);
    dotRef.current.setAttribute("cx", x);
    dotRef.current.setAttribute("cy", y);
  };

  const active = hoveredIndex !== null && !stacked;

  return (
    <section
      ref={sectionRef}
      className={`relative ${className}`}
      style={{ cursor: hoveredIndex !== null ? "pointer" : "default" }}
      onPointerMove={onPointerMove}
      onPointerLeave={() => !stacked && setHoveredIndex(null)}
      onClick={() => {
        if (active) router.push(SYMBOLS[hoveredIndex].href);
      }}
    >
      <Canvas
        dpr={[1, 2]}
        className="!absolute inset-0"
        style={{ backgroundColor: "black" }}
      >
        <OrthographicCamera
          makeDefault
          position={[0, 0, 10]}
          zoom={CAMERA_ZOOM}
        />
        <directionalLight intensity={0.25} position={[0, 1, 2]} />
        <Suspense fallback={null}>
          <Environment files="/hdr/photo-studio_4K.exr" />
          <Row
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            onSelect={(href) => router.push(href)}
          />
        </Suspense>
      </Canvas>

      {/* Desktop: connector line from the hovered symbol to the cursor */}
      <svg
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-200 ${
          active ? "opacity-100" : "opacity-0"
        }`}
      >
        <line
          ref={lineRef}
          stroke="white"
          strokeOpacity={0.4}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        <circle ref={dotRef} r={2.5} fill="white" />
      </svg>

      {/* Desktop: hovered service's name, boxed, beside the cursor */}
      <span
        ref={labelRef}
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 z-10 whitespace-nowrap border border-white/20 bg-black/80 px-2 py-1
                    transition-opacity duration-200 ${active ? "opacity-100" : "opacity-0"}`}
      >
        <h5 className="!mb-0">{lastTitle.current}</h5>
      </span>

      {/* Keyboard + screen reader access to the same links */}
      <ul className="sr-only">
        {SYMBOLS.map((s) => (
          <li key={s.href}>
            <Link href={s.href}>{s.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
