"use client";

// Recording page: each service symbol stacked vertically, full screen, slowly
// spinning and tinted with one of the brand colours from :root.
// All five come from Analytics.glb – it holds the extruded + bevelled version of
// every symbol, whereas the standalone Strategy/Branding/etc. files are flat.

const SOURCE = "/models/symbols/Analytics.glb";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import SymbolModel from "@/components/three/SymbolModel.jsx";

const SYMBOLS = [
  { name: "Strategy", node: "Curve004", accent: "--mesm-yellow" },
  { name: "Branding", node: "Curve001", accent: "--accent" },
  { name: "Website", node: "Curve005", accent: "--mesm-blue" },
  { name: "Performance", node: "Curve002", accent: "--mesm-red" },
  { name: "Analytics", node: "Curve", accent: "--accent2" },
];

// Only mount a canvas while its section is on (or near) screen, so there are
// never more than a couple of WebGL contexts alive at once.
function useNearViewport() {
  const ref = useRef(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: "50% 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, near];
}

function SymbolSection({ name, node, accent }) {
  const [ref, near] = useNearViewport();

  return (
    <section ref={ref} className="relative h-screen w-full">
      {near && (
        <Canvas dpr={2} style={{ backgroundColor: "black" }}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />
          <directionalLight intensity={0.25} position={[0, 1, 2]} />
          <Suspense fallback={null}>
            <Environment files="/hdr/photo-studio_4K.exr" />
            <SymbolModel
              modelPath={SOURCE}
              node={node}
              accent={accent}
              glow={0.12}
              hovered
            />
          </Suspense>
        </Canvas>
      )}
      <p className="absolute bottom-4 left-4 text-xs opacity-40">
        {name} · {accent}
      </p>
    </section>
  );
}

export default function SymbolsSandbox() {
  // ?only=Analytics shows a single symbol (handy for recording one at a time)
  const [only, setOnly] = useState(null);
  useEffect(() => {
    setOnly(new URLSearchParams(window.location.search).get("only"));
  }, []);
  const symbols = only
    ? SYMBOLS.filter((s) => s.name.toLowerCase() === only.toLowerCase())
    : SYMBOLS;

  return (
    <div className="flex flex-col">
      {symbols.map((s) => (
        <SymbolSection key={s.name} {...s} />
      ))}
    </div>
  );
}
