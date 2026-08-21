"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, useProgress } from "@react-three/drei";
import FunnelModel from "./FunnelModel.jsx";

function LoadingBar() {
  const { progress, active } = useProgress();

  return (
    <div
      className="absolute inset-x-8 bottom-4 h-[2px] overflow-hidden rounded-full bg-white/10 transition-opacity duration-300 pointer-events-none"
      style={{ opacity: active ? 1 : 0 }}
    >
      <div
        className="h-full bg-white/70"
        style={{ width: `${progress}%`, transition: "width 0.2s ease-out" }}
      />
    </div>
  );
}

export default function FunnelScene({ flipped = false }) {
  return (
    <div className="relative h-full w-full">
      <Canvas
        style={{ backgroundColor: "black" }}
        className="block h-full w-full border-1 border-[var(--mesm-grey-dk)] rounded-md"
      >
        <directionalLight intensity={0.25} />

        {/* Local boundary so loading the model/HDR doesn't suspend the rest of the page */}
        <Suspense fallback={null}>
          <Environment files="/hdr/photo-studio_4K.exr" />
          <FunnelModel flipped={flipped} />
        </Suspense>
      </Canvas>

      <LoadingBar />
    </div>
  );
}
