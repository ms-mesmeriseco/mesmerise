"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment /*, OrbitControls*/ } from "@react-three/drei";
import Model from "./Model.jsx";

// Notifier stays the same
function SceneLoadedNotifier({ onLoaded }) {
  useEffect(() => {
    onLoaded?.(false);
    return () => onLoaded?.(true);
  }, [onLoaded]);
  return null;
}

// If you use frameloop="demand", invalidate once when we’re ready
function KickOnce() {
  const { invalidate } = useThree();
  useEffect(() => {
    invalidate();
  }, [invalidate]);
  return null;
}

export default function Scene({ onLoaded, quality = "auto" }) {
  const [sceneLoaded, setSceneLoaded] = useState(false);

  // heuristics: if quality === "low" (mobile/low-end), clamp DPR and drop AA & heavy env
  const low = quality === "low";

  return (
    <Canvas
      // Render only when something changes
      frameloop="demand"
      // Lower DPR on mobile; desktop can float up a bit
      dpr={low ? [1, 1.25] : [1, 1.75]}
      // Cheaper WebGL context
      gl={{
        antialias: !low, // off on low
        powerPreference: "low-power", // ask for integrated GPU / less costly path
        stencil: false,
        depth: true,
        alpha: false,
        preserveDrawingBuffer: false,
      }}
      // Avoid layout thrash
      style={{ backgroundColor: "black" }}
      className="block h-[100dvh] w-[100dvw]"
      onCreated={({ gl }) => {
        // limit pixel ratio in case device DPR is wild
        const maxDpr = low ? 1.25 : 1.75;
        const target = Math.min(window.devicePixelRatio || 1, maxDpr);
        gl.setPixelRatio(target);
      }}
    >
      {/* <OrbitControls enableDamping /> */}
      <Suspense fallback={<SceneLoadedNotifier onLoaded={onLoaded} />}>
        <KickOnce />

        {/* cheap-ish lighting */}
        <directionalLight intensity={0.25} position={[0, 1, 2]} />
        {/* Use a tiny preset on low; your EXR only on higher quality */}
        {low ? (
          <Environment preset="studio" />
        ) : (
          <Environment files="/hdr/photo-studio_4K.exr" />
        )}

        <Model />
      </Suspense>
    </Canvas>
  );
}
