"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import Model from "./Model.jsx";

export default function Scene() {
  return (
    <Canvas style={{ backgroundColor: "black" }}>
      {/* <OrbitControls enableDamping /> */}

      <directionalLight intensity={0.25} position={[0, 3, 2]} />
      <Environment files="/hdr/photo-studio_4K.exr" />

      <Model />
      {/* <color attach="background" args={["#ff3700"]} /> */}
    </Canvas>
  );
}
