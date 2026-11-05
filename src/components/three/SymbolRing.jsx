"use client";

// The five service symbols on a flat, horizontal ring. The camera sits
// slightly above the ring so it reads as an ellipse: the front symbol is
// closest to the viewer, the rear one furthest away (and dimmed by fog).
//
// Click either side to turn the ring one fifth that way. The three front
// symbols show their name on hover and open their service page on click; the
// two rear ones aren't interactive, so clicking them just turns the ring.
// On mobile the symbols stack in a vertical column with their names below.

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Html,
  MeshTransmissionMaterial,
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";
import { MathUtils, Vector3 } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Analytics.glb holds the extruded + bevelled version of every symbol
const SOURCE = "/models/symbols/Analytics.glb";

const SYMBOLS = [
  {
    title: "Strategy",
    href: "/services/strategy",
    node: "Curve004",
    accent: "--mesm-yellow",
  },
  {
    title: "Branding",
    href: "/services/branding",
    node: "Curve001",
    accent: "--accent",
  },
  {
    title: "Website",
    href: "/services/website",
    node: "Curve005",
    accent: "--mesm-blue",
  },
  {
    title: "Performance & Growth",
    href: "/services/performance-growth",
    node: "Curve002",
    accent: "--mesm-red",
  },
  {
    title: "Analytics",
    href: "/services/analytics",
    node: "Curve",
    accent: "--accent2",
  },
];

const STEP = (Math.PI * 2) / SYMBOLS.length; // one click = one fifth of the ring
const TURN_EASE = 4; // higher = snappier turn to the next symbol
const SYMBOL_SIZE = 1.1; // world units each symbol's width/height is fitted to
const MAX_RADIUS = 4;
const FACE_YAW = 0.35; // slight angle so the glass edges catch the light
const HOVER_TURN = 0.45; // radians the symbol swivels on hover (~25°)
// A symbol counts as "front" while its depth is above this fraction of the
// radius. The front three sit at +0.31r or more, the rear two at -0.81r.
const FRONT_DEPTH = -0.25;
const MOBILE_BREAKPOINT = 768; // matches Tailwind's md
const CURSOR_OFFSET = 16; // px gap between the cursor and the floating title
const CAMERA_TARGET_Y = -0.6;

const worldPos = new Vector3();

// Bake one node's transforms into a single centred geometry, scaled to fit
function useSymbolGeometry(scene, node) {
  const geometry = useMemo(() => {
    scene.updateMatrixWorld(true);
    const parts = [];
    scene.traverse((child) => {
      if (!child.isMesh || child.name !== node) return;
      const g = child.geometry.clone();
      for (const name of Object.keys(g.attributes)) {
        if (name !== "position" && name !== "normal") g.deleteAttribute(name);
      }
      g.applyMatrix4(child.matrixWorld);
      parts.push(g.index ? g.toNonIndexed() : g);
    });
    const merged = mergeGeometries(parts);
    merged.center();
    merged.computeBoundingBox();
    const { min, max } = merged.boundingBox;
    const s = SYMBOL_SIZE / Math.max(max.x - min.x, max.y - min.y);
    merged.scale(s, s, s);
    return merged;
  }, [scene, node]);

  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

function useCssColor(variable) {
  const [color, setColor] = useState("#ffffff");
  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
    if (value) setColor(value);
  }, [variable]);
  return color;
}

function OrbitingSymbol({
  scene,
  node,
  accent,
  position,
  scale,
  radius,
  faceRef,
  title,
  stacked,
  hovered,
  onHover,
  onSelect,
  onTurn,
}) {
  const geometry = useSymbolGeometry(scene, node);
  const color = useCssColor(accent);
  const isMobile = useThree((s) => s.size.width < 768);
  const orbitRef = useRef();
  const hoverRef = useRef();
  const isFront = useRef(true);

  useFrame((_, delta) => {
    // Front or rear of the ring right now? Drop the hover if it turns away.
    orbitRef.current.getWorldPosition(worldPos);
    isFront.current = stacked || worldPos.z > radius * FRONT_DEPTH;
    if (hovered && !isFront.current) onHover(false);

    const g = hoverRef.current;
    g.rotation.y = MathUtils.damp(
      g.rotation.y,
      hovered ? HOVER_TURN : 0,
      6,
      delta,
    );
  });

  return (
    <group ref={orbitRef} position={position} scale={scale}>
      {/* Counter-rotated each frame so every symbol keeps facing the viewer */}
      <group ref={faceRef}>
        <group
          ref={hoverRef}
          onPointerOver={(e) => {
            if (!isFront.current) return;
            e.stopPropagation();
            onHover(true);
          }}
          onPointerOut={() => onHover(false)}
          onClick={(e) => {
            e.stopPropagation();
            if (isFront.current) onSelect();
            else onTurn(e.nativeEvent);
          }}
        >
          <mesh geometry={geometry}>
            {/* Same glass as the homepage logo */}
            <MeshTransmissionMaterial
              color={color}
              backside={!isMobile}
              backsideThickness={0.1}
              samples={isMobile ? 3 : 6}
              resolution={512}
              thickness={0.05}
              anisotropicBlur={0.1}
              iridescence={2}
              iridescenceIOR={1}
              clearcoat={10}
              envMapIntensity={0.5}
              emissive={color}
              emissiveIntensity={hovered ? 0.3 : 0.12}
            />
          </mesh>
          {/* Invisible square hit area, so thin strokes are easy to click */}
          <mesh>
            <planeGeometry args={[SYMBOL_SIZE * 1.1, SYMBOL_SIZE * 1.1]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>

        {/* Mobile: no hover, so the name always sits under the symbol */}
        {stacked && (
          <Html
            center
            position={[0, -SYMBOL_SIZE * 0.75, 0]}
            style={{ pointerEvents: "none" }}
          >
            <h5 className="whitespace-nowrap">{title}</h5>
          </Html>
        )}
      </group>
    </group>
  );
}

function Ring({ targetRef, hoveredIndex, setHoveredIndex, onSelect, onTurn }) {
  const { scene } = useGLTF(SOURCE);
  const viewport = useThree((s) => s.viewport);
  const stacked = useThree((s) => s.size.width < MOBILE_BREAKPOINT);
  const ringRef = useRef();
  const faceRefs = useRef([]);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  // Pull the ring in on narrow screens so the side symbols stay in frame
  const radius = Math.min(MAX_RADIUS, viewport.width * 0.36);

  // Mobile column: one slot per symbol, shrunk to leave room for the name
  const slot = viewport.height / SYMBOLS.length;
  const stackScale = Math.min(1, (slot * 0.55) / SYMBOL_SIZE);

  const layout = (i) => {
    if (stacked) {
      const y = CAMERA_TARGET_Y + ((SYMBOLS.length - 1) / 2 - i) * slot;
      return { position: [0, y, 0], scale: stackScale };
    }
    const angle = (i / SYMBOLS.length) * Math.PI * 2;
    return {
      position: [Math.sin(angle) * radius, 0, Math.cos(angle) * radius],
      scale: 1,
    };
  };

  useFrame((_, delta) => {
    const ring = ringRef.current;
    if (stacked) targetRef.current = 0; // no turning in the mobile column
    // Ease towards the clicked-to angle (snap if the user prefers less motion)
    ring.rotation.y = reducedMotion.current
      ? targetRef.current
      : MathUtils.damp(ring.rotation.y, targetRef.current, TURN_EASE, delta);
    for (const face of faceRefs.current) {
      if (face) face.rotation.y = -ring.rotation.y + FACE_YAW;
    }
  });

  return (
    <group ref={ringRef}>
      {SYMBOLS.map((s, i) => (
        <OrbitingSymbol
          key={s.title}
          scene={scene}
          node={s.node}
          accent={s.accent}
          {...layout(i)}
          radius={radius}
          stacked={stacked}
          faceRef={(el) => (faceRefs.current[i] = el)}
          title={s.title}
          onTurn={onTurn}
          hovered={hoveredIndex === i}
          onHover={(on) =>
            setHoveredIndex((cur) => (on ? i : cur === i ? null : cur))
          }
          onSelect={() => onSelect(s.href)}
        />
      ))}
    </group>
  );
}

export default function SymbolRing({ className = "" }) {
  const router = useRouter();
  const wrapperRef = useRef(null);
  const labelRef = useRef(null);
  // Ring angle to turn to. A symbol at angle a sits at a + rotation, and the
  // front of the ring is 0, so +STEP brings the left-hand symbol forward.
  const targetRef = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  // Keep showing the last title while the label fades out
  const lastTitle = useRef("");
  if (hoveredIndex !== null) lastTitle.current = SYMBOLS[hoveredIndex].title;

  // Empty space: arrow cursor pointing the way the ring will turn
  const sideCursor = (e) => {
    const box = wrapperRef.current.getBoundingClientRect();
    return e.clientX - box.left < box.width / 2 ? "w-resize" : "e-resize";
  };

  // Clicks on empty space or a rear symbol turn the ring towards that side
  const turnFromClick = (e) => {
    const box = wrapperRef.current.getBoundingClientRect();
    if (box.width < MOBILE_BREAKPOINT) return; // mobile column doesn't turn
    const dir = e.clientX - box.left < box.width / 2 ? -1 : 1;
    targetRef.current += dir * STEP;
  };

  return (
    <section
      ref={wrapperRef}
      className={`relative ${className}`}
      onPointerMove={(e) => {
        e.currentTarget.style.cursor =
          hoveredIndex !== null ? "pointer" : sideCursor(e);
        // Move the floating title with the cursor directly, without re-rendering
        const box = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - box.left + CURSOR_OFFSET;
        const y = e.clientY - box.top + CURSOR_OFFSET;
        labelRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }}
    >
      <Canvas
        dpr={[1, 2]}
        className="!absolute inset-0"
        style={{ backgroundColor: "black" }}
        onPointerMissed={turnFromClick}
      >
        {/* Aimed a touch below the centre (the front symbol hangs lower than
            the rear one rises) so the ring sits in the middle of a tight frame */}
        <PerspectiveCamera
          makeDefault
          position={[0, 1.8, 10]}
          fov={32}
          onUpdate={(c) => c.lookAt(0, CAMERA_TARGET_Y, 0)}
        />
        {/* Rear symbols fade into the black for extra depth */}
        <fog attach="fog" args={["#000000", 8, 20]} />
        <directionalLight intensity={0.25} position={[0, 1, 2]} />
        <Suspense fallback={null}>
          <Environment files="/hdr/photo-studio_4K.exr" />
          <Ring
            targetRef={targetRef}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            onSelect={(href) => router.push(href)}
            onTurn={turnFromClick}
          />
        </Suspense>
      </Canvas>

      {/* Desktop: hovered service's name follows the cursor */}
      <span
        ref={labelRef}
        aria-hidden="true"
        className={`pointer-events-none absolute left-0 top-0 z-10 hidden md:block whitespace-nowrap
                    transition-opacity duration-200 ${hoveredIndex !== null ? "opacity-100" : "opacity-0"}`}
      >
        <h4>{lastTitle.current}</h4>
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

useGLTF.preload(SOURCE);
