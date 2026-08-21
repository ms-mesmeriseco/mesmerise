"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import FunnelModel from "./FunnelModel.jsx";

export default function FunnelScene({ flipped = false }) {
  return (
    <Canvas
      style={{ backgroundColor: "black" }}
      className="block h-full w-full border-1 border-[var(--mesm-grey-dk)] rounded-md"
    >
      <directionalLight intensity={0.25} />
      <Environment files="/hdr/photo-studio_4K.exr" />

      <FunnelModel flipped={flipped} />
    </Canvas>
  );
}
